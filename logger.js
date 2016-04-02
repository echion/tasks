'use strict';

var bunyan = require('bunyan'),
    env = require('./config'),
    streams = env.get('LOG_STREAMS').map(function(options) {
        if (!options.factory) return options;

        var factory = require(options.factory);

        delete options.factory;

        return factory(options);
    });

module.exports = bunyan.createLogger({
    name: 'echion-tasks',
    streams: streams
});

