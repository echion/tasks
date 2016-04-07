'use strict';

var bunyan = require('bunyan'),
    _ = require('lodash/lang'),
    loggerConfig = require('./logging/logger-config'),
    logger = bunyan.createLogger(loggerConfig),
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
        if (_.isError(arguments[0])) {
            context.err = arguments[0];
            sliceStart = 1;
        }
        else if (_.isObject(arguments[0])) {
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

