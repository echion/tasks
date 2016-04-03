'use strict';

module.exports = function(err, req, res, next) {
    var validation = require('express-validation'),
        logger = require('../logger'),
        RuleError = require('../models/rule-error');

    if (err instanceof validation.ValidationError || err instanceof RuleError) {
        logger.info(err, 'Validation error');

        return res.status(400).json(err);
    }

    return next(err);
};