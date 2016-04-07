'use strict';

module.exports = function(options) {
    var createCWStream = require('bunyan-cloudwatch');

    options.logGroupName = 'echion';
    options.logStreamName = 'echion-tasks';
    options.cloudWatchLogsOptions = {
        region: 'us-east-1'
    };

    return {
        type: 'raw',
        stream: createCWStream(options)
    };
};
