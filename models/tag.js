'use strict';

const db = require('../db'),
	  label = 'Tag',
	  indexName = 'Tags',
	  logger = require('../logger');

function updateAsync(tag, newName) {
	return new Promise(function(resolve, reject) {
		var batch = db.batch();

		// newName = newName.trim();
		tag.name = newName;
		tag.normalizedName = newName.toLowerCase();

		batch.save(tag);
		batch.node.legacyindex.remove(indexName, tag.id);
		batch.node.legacyindex.add(indexName, tag.id, 'name', tag.normalizedName);

		batch.commit(function(err,results) {
			if (err) return reject(err);

			resolve(transform(tag));
		});
	});
}

function transform(tag) {
	if (!tag) return tag;

	delete tag.Tag;
	delete tag.normalizedName;

	return tag;
}

var model = module.exports = {
	findByIdAsync: function(id) {
		return db.readAsync(id)
				 .then(function(tag) {
				 	tag = transform(tag);

				 	return Promise.resolve(tag);
				 });
	},
	findAsync: function(name) {
		if (name)
			return db.fulltext.findAsync(indexName, 'name', name, transform);

		return db.nodesWithLabelAsync(label)
				 .then(function(tags) {
					tags = tags.map(transform);

					return Promise.resolve(tags);				 	
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

				resolve(results);
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

				resolve(tag);
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
									.then(function(tag) {
										return Promise.resolve({
											model: tag,
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
		return db.deleteAsync(id, true);
	}
};