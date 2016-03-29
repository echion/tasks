'use strict';

var db = require('../../db');

function deleteLegacyIndexAsync(name) {
	return new Promise(function(resolve) {
		db.node.legacyindex.delete(name, function() {
			resolve(); //ignore errors
		});
	});
}

module.exports = function(done) {
	var request = require('superagent'),
		env = require('../../config'),
		logger = require('../../logger'),
		migrations = require('../../initializers/migrations');

	deleteLegacyIndexAsync('Tags')
		.then(function() {
			return migrations.createLegacyIndicesAsync();
		})
		.then(function() {
			request
				.post(env.get('DB_URI') + '/graphaware/resttest/clear')
				.auth(env.get('DB_USER'), env.get('DB_PASSWORD'))
				.end(function() {
					logger.debug('database cleared');		

					done();
				});

			return Promise.resolve();
		})
		.catch(done);
};