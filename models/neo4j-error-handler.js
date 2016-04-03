'use strict';

module.exports = function(err) {
    if (err.code && err.code.search('NotFound') > -1)
        return Promise.resolve();

    return Promise.reject(err);
};