'use strict';

const db = require('../db'),
	  label = 'Tag';

module.exports = {
	findByIdAsync: function(id) {
		return db.readAsync(id);
	},
	findAsync: function(name) {
		var predicate = {};

		if (name)
			predicate.normalizedName = name.toLowerCase();

		return db.findAsync(predicate, label);
	},
	findByResultIdAsync: function(id) {
		return db.queryAsync('START r=node({id}) MATCH (Result)-[:tagged]->(t:Tag) RETURN t',
							 { id: parseInt(id) });
	},
	getByNameOrDefineAsync: function(name) {
		return db.findAsync({ normalizedName: name.toLowerCase() }, label)
				 .then(function(tags) {
				 	if (tags.length > 0)
				 		return Promise.resolve(tags[0]);

				 	return db.saveAsync({ 
				 		name: name, 
				 		normalizedName: name.toLowerCase()
				 	}, label);
				 });
	},
	renameAsync: function(id, newName) {
		return db.readAsync(id)
				 .then(function(tag) {
				 	tag.name = newName;
				 	tag.normalizedName = newName.toLowerCase();

				 	return db.saveAsync(tag);
				 });
	},
	deleteAsync: function(id) {
		return db.deleteAsync(id, true);
	}
};