module.exports = function(asyncCallback) {
  'use strict';

  var express = require('express'),
      app = express(),
      files = require('require-dir')('./api'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      logger = require('winston'),
      router = express.Router(),
      port = process.env.API_PORT || 8080;
    
  app.disable('etag');
  app.use(morgan('common'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({type: '*/*'}));

  logger.info('[SERVER] Initializing routes');
  
  Object.keys(files).forEach(function(file) {
    require('./api/' + file)(router);
  });

  app.use(router);
  
  //Error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (app.get('env') === 'development' ? err : {})
    });
    next(err);
  });
  
  logger.info('[SERVER] Listening on port ' + port);

  app.listen(port);
  
  if (asyncCallback)
    return asyncCallback();
};
