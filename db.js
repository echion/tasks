'use strict';

var env = require('./config'),
	db = require("seraph")({ 
		server: env.get('DB_URI'),
		user: env.get('DB_USER'),
		pass: env.get('DB_PASSWORD') 
	}),
	BPromise = require('bluebird');

module.exports = BPromise.promisifyAll(db);
