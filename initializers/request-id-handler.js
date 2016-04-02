'use strict';

module.exports = {
    name: 'request-id',
    configure: function(app) {
        app.use(function(req, res, next) {
            req.requestId = req.get('X-Request-Id') || req.query.requestId || require('node-uuid')();
            next();
        });
    }
};