'use strict';

module.exports = function(options) {
    var createCWStream = require('bunyan-cloudwatch');

    return {
        type: 'raw',
        stream: createCWStream(options)
    };
};
