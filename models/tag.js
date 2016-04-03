'use strict';

var db = require('../db'),
    label = 'Tag',
    indexName = 'Tags',
    neo4jErrorHandler = require('./neo4j-error-handler');

function transform(tag) {
    if (!tag) return tag;

    delete tag.Tag;
    delete tag.normalizedName;

    return tag;
}

function updateAsync(tag, newName) {
    return new Promise(function(resolve, reject) {
        var batch = db.batch();

        tag.name = newName;
        tag.normalizedName = newName.toLowerCase();

        batch.save(tag);
        batch.node.legacyindex.remove(indexName, tag.id);
        batch.node.legacyindex.add(indexName, tag.id, 'name', tag.normalizedName);

        batch.commit(function(err,results) {
            if (err) return reject(err);

            return resolve(transform(tag));
        });
    });
}

var model = module.exports = {
    findByIdAsync: function(id) {
        return db.readAsync(id)
                .then(function(tag) {
                    return Promise.resolve(transform(tag));
                });
    },
    findAsync: function(name) {
        if (name)
            return db.fulltext.findAsync(indexName, 'name', name, transform);

        return db.nodesWithLabelAsync(label)
                .then(function(tags) {
                    return Promise.resolve(tags.map(transform));
                });
    },
    findByNameAsync: function(name) {
        return new Promise(function(resolve, reject) {
            db.legacyindex.read(indexName, 'name', name.toLowerCase(), function(err, results) {
                if (err) {
                    if (err.statusCode === 404)
                        return resolve(null);

                    return reject(err);
                }

                return resolve(results);
            });
        });
    },
    findByResultIdAsync: function(id) {
        return db.queryAsync('START r=node({id}) MATCH (Result)-[:tagged]->(t:Tag) RETURN t',
                             { id: parseInt(id) });
    },
    defineAsync: function(name) {
        return new Promise(function(resolve, reject) {
            var entity = {
                    name: name,
                    normalizedName: name.toLowerCase()
                },
                batch = db.batch();

            var node = batch.save(entity);

            batch.label(node, label);
            batch.node.legacyindex.add(indexName, node, 'name', entity.normalizedName);

            batch.commit(function(err, results) {
                if (err) return reject(err);

                var tag = transform(results[0]);

                return resolve(tag);
            });
        });
    },
    getByNameOrDefineAsync: function(name) {
        return model.findByNameAsync(name)
                    .then(function(tag) {
                        if (tag) return Promise.resolve({
                            model: tag
                        });

                        return model.defineAsync(name)
                                    .then(function(newTag) {
                                        return Promise.resolve({
                                            model: newTag,
                                            created: true
                                        });
                                    });
                    });
    },
    renameAsync: function(id, newName) {
        return db.readAsync(id)
                .then(function(tag) {
                    if (!tag) return Promise.reject();

                    return updateAsync(tag, newName);
                });
    },
    deleteAsync: function(id) {
        return db.deleteAsync(id, true)
                .catch(neo4jErrorHandler);
    }
};