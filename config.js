'use strict';

var env = require('envalid');

env.validate(process.env, {
    NODE_ENV: { required: true, choices: ['production', 'test', 'development'] },
    DB_URI: { required: true },
    DB_USER: { required: true },
    DB_PASSWORD: { required: true },
    LOG_STREAMS: {
        parse: JSON.parse,
        default: [
            {
                level: 'warn',
                stream: process.stdout
            }
        ]
    },
    API_PORT: { parse: env.toNumber, default: 8080 }
});

module.exports = env;