module.exports = function(err, req, res, next) {
	'use strict';
	
	var logger = require('../logger');

    logger.warn(err);

    next(err);
};