'use strict';

function mapLogStream(options) {
    if (!options.factory) return options;

    var factory = require(options.factory);

    delete options.factory;

    return factory(options);
}

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

var bunyan = require('bunyan'),
    env = require('./config'),
    streams = env.get('LOG_STREAMS').map(mapLogStream),
    logger = bunyan.createLogger({
        name: 'echion-tasks',
        serializers: {
            err: bunyan.stdSerializers.err,
            req: serializeRequest,
            user: onlyReturn,
        },
        streams: streams
    }),
    getNamespace = require('continuation-local-storage').getNamespace;

function log(level) {
    return function() {
        var namespace = getNamespace('echion.tasks.request'),
            context = {},
            newArgs = [],
            sliceStart = 0;

        // Figure out if the first parameter is an error or an object.
        // If it's an error, add it to the context so that it complies
        // with the the 'fields' parameter for Bunyan logger calls.
        if (arguments[0] instanceof Error) {
            context.err = arguments[0];
            sliceStart = 1;
        }
        else if (arguments[0] instanceof Object) {
            context = arguments[0];
            sliceStart = 1;
        }

        newArgs.push(context);

        // merge the arrays
        Array.prototype.push.apply(newArgs, Array.prototype.slice.call(arguments, sliceStart));

        // populate context from the request namespace
        if (namespace) {
            context.req = namespace.get('request');
            context.res = namespace.get('response');
            context.user = namespace.get('user');
        }

        logger[level].apply(logger, newArgs);
    };
}

function Logger() {
}

Logger.prototype.trace = log('trace');
Logger.prototype.debug = log('debug');
Logger.prototype.info = log('info');
Logger.prototype.warn = log('warn');
Logger.prototype.error = log('error');
Logger.prototype.fatal = log('fatal');

module.exports = new Logger();

