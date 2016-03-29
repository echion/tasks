'use strict';

var db = require('../db');

var migrationsModule = module.exports = {
	name: 'db',
	configure: function(app) {
		return db.constraints.uniqueness.createIfNoneAsync('Tag', 'normalizedName')
				 .then(function() {
				 	return migrationsModule.createLegacyIndicesAsync();
				 });
	},
	createLegacyIndicesAsync: function() {
		return new Promise(function(resolve, reject) {
			var options = {
				provider: 'lucene',
				type: 'fulltext'
		   	};

		   	options['to_lower_case'] = true;

		 	db.node.legacyindex.create('Tags', options, function(err, results) {
		 		resolve();
		 	});
		});
	}
};