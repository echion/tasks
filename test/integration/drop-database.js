'use strict';

module.exports = function(done) {
	var mongoose = require('mongoose'),
		env = require('../../config'),
		conn = mongoose.createConnection(env.get('DB_URI'));

	conn.once('open', function() {
       	for (var i in mongoose.connection.collections) {
	      mongoose.connection.collections[i].remove(function() {});
	    }
	    
	    done();
    });
};