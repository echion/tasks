'use strict';

module.exports = {
    name: 'server',
    after: 'request-id',
    configure: function(app) {
        var bodyParser = require('body-parser');

        app.disable('etag');
        app.use(require('helmet')());

        // parse all media types
        app.use(bodyParser.json({ type: '*/*' }));

        // allows for rich objects and arrays to be encoded into the URL-encoded format
        app.use(bodyParser.urlencoded({ extended: true }));
    }
};