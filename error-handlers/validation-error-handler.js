module.exports = function(err, req, res, next) {
	'use strict';
	
    var validation = require('express-validation');

    if (err instanceof validation.ValidationError) 
      return res.status(err.status || 400).json(err);

    next(err);
};