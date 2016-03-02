'use strict';

var env = require('./config'),
    server = require('./server'),
    async = require('async'),
    logger = require('./logger'),
    mongoose = require('mongoose'),
    app;

logger.info('[APP] Starting initialization...');

// Initialize Modules
async.series([
	function(done) {
		mongoose.connect(env.get('DB_URI'), done);
	},
	function(done) {
		app = server(done);
	}
], 
function(err) {
	if (err)
		logger.error('[APP] Initialization failed.', err);
	else
  		logger.info('[APP] Initialized.');
});

module.exports = app;