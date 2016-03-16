'use strict';

const db = require('../db'),
	  label = 'Tag';

module.exports = {
	findByIdAsync: function(id) {
		return db.readAsync(id);
	},
	findAsync: function(predicate, any) {
		return db.findAsync(predicate || {}, any, label);
	},
	getByNameOrCreateAsync: function(name) {
		return db.findAsync({ name: name }, label)
				 .then(function(tags) {
				 	if (tags.length > 0)
				 		return Promise.resolve(tags[0]);

				 	return db.saveAsync({ name: name }, label);
				 });
	},
	renameAsync: function(id, newName) {
		return db.readAsync(id)
				 .then(function(tag) {
				 	tag.name = newName;

				 	return db.saveAsync(tag);
				 });
	},
	deleteAsync: function(id) {
		return db.deleteAsync(id, true);
	}
};