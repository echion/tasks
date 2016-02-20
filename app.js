'use strict';

var routes = require('./routes'),
    async = require('async'),
    logger = require('winston');

logger.info('[APP] Starting server initialization');

// Initialize Modules
async.series([routes], 
  function(err) {
    if (err)
      logger.error('[APP] initialization failed', err);
    else
      logger.info('[APP] initialized');
  }
);