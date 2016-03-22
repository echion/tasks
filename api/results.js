module.exports = function(router) {
  	'use strict';

  	var Model = require('../models/result'),
  		rules = require('../validation'),
  		validate = require('express-validation');

	router.get('/results', function(req, res, next) {
		Model.findAsync(req.query)
			 .then(function(result) { 
			 	res.json(result); 
			 })
			 .catch(next);
	});

	router.get('/results/:id', validate(rules.id), function(req, res, next) {
		Model.findByIdAsync(req.params.id)
			 .then(function(result) { 
			 	res.json(result); 
			 })
			 .catch(next);
	});

	router.post('/results', validate(rules.result), function(req, res, next) {
		Model.defineAsync(req.body)
			 .then(function(result) { 
			 	res.status(201).json(result); 
			 })
			 .catch(next);
	});

	router.put('/results/:id', validate(rules.result), function(req, res, next) {
		req.body.id = req.params.id;

		Model.updateAsync(req.body)
			 .then(function(result) {
			 	res.json(result); 
			 })
			 .catch(next);
	});

	router.delete('/results/:id', validate(rules.id), function(req, res, next) {
		Model.deleteAsync(req.params.id)
			 .then(function() {
			 	res.sendStatus(204);
			 })
			 .catch(next);
	});
};