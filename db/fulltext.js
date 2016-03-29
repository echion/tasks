'use strict';

var env = require('../config'),
    url = require('url'),
    util = require('util'),
    pathFormat = '/db/data/index/node/%s?query=%s:%s',
    request = require('request-promise'),
    logger = require('../logger');

function extractId(location) {
    // get the last part of the path, which is the id
    var matches = location.match(/\/(\d+)$/);

    return matches ? parseInt(matches[1], 10) : null;
}

function createNodeObject(nodeData) {
    var nodeObj = nodeData.data || {};

    // nodeData has a self url link
    nodeObj.id = extractId(nodeData.self);

    return nodeObj;
}

var fulltextModule = module.exports = {
    findOneAsync: function(indexName, key, value, transform) {
        return fulltextModule
                .findAsync(indexName, key, value, transform)
                .then(function(results) {
                    return Promise.resolve((results && results.length) ? results[0] : null);
                });
    },
    findAsync: function(indexName, key, value, transform) {
        var path = util.format(pathFormat,
                               encodeURIComponent(indexName),
                               encodeURIComponent(key),
                               encodeURIComponent(value.toLowerCase()));
        var uri = url.resolve(env.get('DB_URI'), path);

        logger.debug('[QUERY] GET ' + uri);

        var options = {
            uri: uri,
            auth: {
                user: env.get('DB_USER'),
                pass: env.get('DB_PASSWORD')
            },
            json: true,
            transform: function(results) {
                return results.map(function(entity) {
                    var obj = createNodeObject(entity);

                    if (transform) return transform(obj);

                    return obj;
                });
            }
        };

        return request(options);
    }
};