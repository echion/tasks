'use strict';

module.exports = function(err, req, res, next) {
    var logger = require('../logger');

    logger.warn(err);

    next(err);
};