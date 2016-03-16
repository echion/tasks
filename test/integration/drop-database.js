module.exports = function(done) {
	'use strict';

	var request = require('superagent'),
		env = require('../../config'),
		logger = require('../../logger');

	request
		.post(env.get('DB_URI') + '/graphaware/resttest/clear')
		.auth(env.get('DB_USER'), env.get('DB_PASSWORD'))
		.end(done);

	logger.debug('database cleared');
	
	// var //mongoose = require('mongoose'),
	// 	env = require('../../config'),
	// 	//conn = mongoose.createConnection(env.get('DB_URI'));

	// conn.once('open', function() {
 //       	for (var i in mongoose.connection.collections) {
	//       mongoose.connection.collections[i].remove(function() {});
	//     }
	    
	//     done();
 //    });
};