module.exports = {
  name: 'server',
  configure: function(app) {
    'use strict';

    var bodyParser = require('body-parser'),
        logger = require('../logger');

    app.disable('etag');
    app.use(require('helmet')());
    app.use(require('morgan')('common', { 
        "stream": logger.stream 
    }));

    // parse all media types
    app.use(bodyParser.json({ type: '*/*' }));

    // allows for rich objects and arrays to be encoded into the URL-encoded format
    app.use(bodyParser.urlencoded({ extended: true }));  
  }
};