module.exports = function(done) {
  'use strict';

  var env = require('./config'),
      express = require('express'),
      app = express(),
      validation = require('express-validation'),
      errorHandler = require('errorhandler'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      logger = require('./logger'),
      helmet = require('helmet'),
      port = env.get('API_PORT');

  app.disable('etag');
  app.use(helmet());
  app.use(morgan('common'));

  // allows for rich objects and arrays to be encoded into the URL-encoded format
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // parse all media types
  app.use(bodyParser.json({ type: '*/*' }));

  require('./api')(app);

  // handle validation errors
  app.use(function(err, req, res, next) {
    if (err instanceof validation.ValidationError) 
      return res.status(err.status).json(err);
  });

  app.use(errorHandler({
    showStack: env.isDev
  }));

  app.listen(port, function() {
    logger.info('[SERVER] Listening on port ' + port);
    done();
  });

  return app;
};
