'use strict';

var env = require('../config'),
    bunyan = require('bunyan');

function onlyReturn(value) {
    return value;
}

function serializeRequest(req) {
    if (!req) return req;

    req.connection = req.connection || {};

    return {
        id: req.id,
        method: req.method,
        url: req.url,
        headers: req.headers,
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort
    };
}

function mapLogStream(options) {
    if (!options.factory) return options;

    var factory = require('./' + options.factory);

    delete options.factory;

    return factory(options);
}

module.exports = {
    name: 'echion-tasks',
    serializers: {
        err: bunyan.stdSerializers.err,
        req: serializeRequest,
        user: onlyReturn,
    },
    streams: env.get('LOG_STREAMS').map(mapLogStream)
};