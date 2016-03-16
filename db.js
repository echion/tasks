'use strict';

var env = require('./config'),
	db = require("seraph")({ 
		server: env.get('DB_URI'),
		user: env.get('DB_USER'),
		pass: env.get('DB_PASSWORD') 
	}),
	BPromise = require('bluebird');

module.exports = BPromise.promisifyAll(db);

// var mongoose = require('mongoose'),
// 	env = require('./config'),
// 	logger = require('./logger'); 

// mongoose.connect(env.get('DB_URI')); 

// mongoose.connection.on('connected', function () {  
//   logger.debug('[DB] Mongoose connection open to ' + env.get('DB_URI'));
// }); 

// mongoose.connection.on('error',function (err) {  
//   logger.error('[DB] Mongoose connection error',  { error: err });
// }); 

// mongoose.connection.on('disconnected', function () {  
//   logger.debug('[DB] Mongoose connection disconnected'); 
// });

// // If the Node process ends, close the Mongoose connection 
// process.on('SIGINT', function() {  
//   mongoose.connection.close(function () { 
//     console.log('[DB] Mongoose connection disconnected through app termination'); 
//     process.exit(0); 
//   }); 
// }); 
