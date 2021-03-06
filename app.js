'use strict';

require('continuation-local-storage')
    .createNamespace('echion.tasks.request');

var env = require('./config'),
    logger = require('./logger'),
    port = env.get('API_PORT'),
    app = require('express')(),
    initialize = require('express-initializers');

logger.info('Starting initialization...');

initialize(app)
    .then(function () {
        app.listen(port, function() {
            logger.info('Listening on port %d', port);
        });
    })
    .catch(function (err) {
        logger.error({ err: err }, 'Failed to initialize the API');
    });

module.exports = app;