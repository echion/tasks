var logger = require('winston'),
	env = require('./config');

logger.level = env.get('LOG_LEVEL');

module.exports = logger;

