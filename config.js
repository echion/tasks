'option strict';

var env = require('envalid');

env.validate(process.env, {
    NODE_ENV: { required: true, choices: [ 'production', 'test', 'development' ] },
    DB_URI: { required: true },
    DB_USER: { required: true },
    DB_PASSWORD: { required: true },
    //DB_OPTIONS: { parse: JSON.parse, default: {} },
    LOG_LEVEL: { default: 'debug' },
    API_PORT: { parse: env.toNumber, default: 8080 }
});

module.exports = env;