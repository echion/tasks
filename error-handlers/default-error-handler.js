module.exports = function(err, req, res, next) {
	'use strict';

    var env = require('../config'),
    	status = err.status || err.statusCode || 500;

    res.status(status).json({
      message: err.message,
      stack: env.isDev ? err.stack : undefined,
      status: status
    });
};