'use strict';

module.exports = {
    name: 'errorHandlers',
    after: 'routes',
    configure: require('../error-handlers')
};