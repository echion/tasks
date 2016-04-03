'use strict';

module.exports = {
    name: 'request-id',
    configure: function(app) {
        var getNamespace = require('continuation-local-storage').getNamespace,
            uuid = require('node-uuid'),
            namespace = getNamespace('echion.tasks.request');

        app.use(function(req, res, next) {
            req.id = req.get('X-Request-Id') || req.query.requestId || uuid.v4();

            namespace.bindEmitter(req);
            namespace.bindEmitter(res);

            namespace.run(function() {
                namespace.set('request', req);

                next();
            });
        });
    }
};