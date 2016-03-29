'use strict';

module.exports = function(err, req, res, next) {
    var env = require('../config');

    if (err.statusCode === 404)
        return res.status(404).json({
            message: 'Not found',
            stack: env.isDev ? err.stack : undefined,
            status: 404
        });

    return next(err);
};