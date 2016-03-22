'use strict';

const db = require('../db'),
	  label = 'Result',
	  array = require('lodash/array'),
	  collection = require('lodash/collection');

module.exports = {
	findByIdAsync: function(id) {
		return db.readAsync(id);
	},
	findAsync: function(predicate, any) {
		return db.findAsync(predicate || {}, any, label);
	},
	defineAsync: function(object) {
		return new Promise(function(resolve, reject) {
			var batch = db.batch();
			var tagIds = object.tags;

			delete object.tags;

			var result = batch.save(object);

			batch.label(result, label);

			if (tagIds) {
				tagIds.forEach(function(tagId) {
					batch.relate(result, 'tagged', tagId);
				});
			}

			batch.commit(function(err, batchResults) {
				if (err) return reject(err);

				resolve(batchResults[0]);
			});
		});
	},
	updateAsync: function(id, object) {
		object.id = id;

		return db.saveAsync(object, label);
	},
	updateTagsAsync: function(resultId, tagIds) {
	    return new Promise(function(resolve, reject) {
	    	db.relationshipsAsync(resultId, 'out', 'tagged')
		      .then(function(relationships) {
				var relatedTagIds = relationships.map(function(r) { return r.end; }), 
				    removedTagIds, 
				    newTagIds,
				    batch = db.batch();

				removedTagIds = array.difference(relatedTagIds, tagIds);
				newTagIds = array.difference(tagIds, relatedTagIds);

				// remove relationships
				relationships.filter(function(r) { 
					return array.findIndex(removedTagIds, r.end) === -1;
				})
				.forEach(function(r) {
					batch.rel.delete(r.id);
				});

				// add relationships
				newTagIds.forEach(function(tagId) {
					batch.relate(resultId, 'tagged', tagId);
				});

				batch.commit(function(err, batchResults) {
					if (err) return reject(err);

					resolve();
				});
	    	});
	  	});
	},
	deleteAsync: function(id) {
		return db.deleteAsync(id, true);
	},
	removeTagAsync: function(resultId, tagId) {
		return new Promise(function(resolve, reject) {
			db.relationshipsAsync(resultId, 'out', 'tagged')
			  .then(function(relationships) {
	 			 var rel = relationships.find(function(r) { return r.end === tagId; });

		 		 if (!rel) return resolve();

		 		 db.rel.delete(rel, function(err, res) {
		 		 	if (err) return reject(err);
		 		 	
		 		 	resolve();
		 		 });
			  });
		});
	}
};