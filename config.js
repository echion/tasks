//'option strict';

var env = require('envalid');

console.log('validating environment config...');

env.validate(process.env, {
    NODE_ENV: { required: true, choices: [ 'production', 'test', 'development' ] },
    DB_URI: { required: true },
    DB_OPTIONS: { parse: JSON.parse, default: {} },
    API_PORT: { recommended: true, parse: env.toNumber, default: 8080 }
});

module.exports = env;