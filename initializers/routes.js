'use strict';

module.exports = {
    name: 'routes',
    after: 'server',
    configure: require('../api')
};