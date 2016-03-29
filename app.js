'use strict';

var env = require('./config'),
    logger = require('./logger'),
    port = env.get('API_PORT'),
    app = require('express')(),
    initialize = require('express-initializers');

logger.info('[APP] Starting initialization...');

initialize(app)
    .then(function () {
        app.listen(port, function() {
            logger.info('[APP] Listening on port ' + port);
        });
    })
    .catch(function (err) {
        logger.error('[APP] Failed to initialize the API', { error: err });
    });

module.exports = app;