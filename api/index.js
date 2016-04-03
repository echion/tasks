'use strict';

module.exports = function(app) {
    var controllers = require('require-dir')(),
        express = require('express'),
        logger = require('winston'),
        router = express.Router();

    logger.debug('Initializing routes...');

    Object.keys(controllers).forEach(function(controllerName) {
        logger.debug('%s initialized.', controllerName);

        controllers[controllerName](router);
    });

    app.use(router);
};