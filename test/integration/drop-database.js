'use strict';

module.exports = function(done) {
	var mongoose = require('mongoose'),
		env = require('../../config');

	mongoose.connect(env.get('DB_URI'), function() {
        mongoose.connection.db.dropDatabase(function() {
        	console.log('database dropped');
            done();
        });    
    });
};