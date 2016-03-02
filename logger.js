'use strict';

var logger = require('winston'),
	env = require('./config');

logger.level = env.get('LOG_LEVEL');
logger.stream = { 
  write: function(message, encoding){ 
    logger.info(message); 
  } 
}; 

module.exports = logger;

