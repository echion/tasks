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
  app.use(morgan('common', { "stream": logger.stream }));

  // allows for rich objects and arrays to be encoded into the URL-encoded format
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // parse all media types
  app.use(bodyParser.json({ type: '*/*' }));

  // register all api routes
  require('./api')(app);

  app.use(function(err, req, res, next) {
    logger.debug(err);

    next(err);
  });

  // handle validation errors
  app.use(function(err, req, res, next) {
    if (err instanceof validation.ValidationError) 
      return res.status(err.status || 400).json(err);

    next(err);
  });

  // neo4j not found errors
  app.use(function(err, req, res, next) {
    if (err.neo4jException === 'NodeNotFoundException') {
      return res.status(404).json({
        message: 'Not found',
        stack: env.isDev ? err.stack : undefined,
        status: 404
      });
    }

    next(err);
  });

  app.use(function(err, req, res, next) {
    var status = err.status || err.statusCode || 500;

    res.status(status).json({
      message: err.message,
      stack: env.isDev ? err.stack : undefined,
      status: status
    });
  });

  app.listen(port, function() {
    logger.info('[SERVER] Listening on port ' + port);
    done();
  });

  return app;
};
