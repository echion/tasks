'use strict';

var env = require('./config'),
    routes = require('./routes'),
    async = require('async'),
    logger = require('winston'),
    app = require('express')();

logger.info('[APP] Starting server initialization');

// Initialize Modules
async.parallel([
	function(done) {
		routes(app);
		done();
	}
], 
function(err) {
	if (err)
		logger.error('[APP] initialization failed', err);
	else
  		logger.info('[APP] initialized');
});

module.exports = app;