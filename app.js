'use strict';

var env = require('./config'),
    server = require('./server'),
    async = require('async'),
    logger = require('./logger'),
    app;

logger.info('[APP] Starting initialization...');

// Initialize Modules
async.series([
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