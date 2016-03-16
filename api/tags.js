module.exports = function(router) {
  	'use strict';

  	var Model = require('../models/tag'),
  		rules = require('../validation'),
  		validate = require('express-validation');

	router.get('/tags', function(req, res, next) {
		Model.findAsync(req.query.name)
			 .then(function(tag) { 
			 	res.json(tag || []); 
			 })
			 .catch(next);
	});

	router.get('/tags/:id', validate(rules.id), function(req, res, next) {
		Model.findByIdAsync(req.params.id)
			 .then(function(tag) { 
			 	res.json(tag); 
			 })
			 .catch(next);
	});

	router.post('/tags', validate(rules.tag), function(req, res, next) {
		Model.getByNameOrDefineAsync(req.body.name)
			 .then(function(tag) { 
			 	res.status(200).json(tag); 
			 })
			 .catch(next);
	});

	router.put('/tags/:id', validate(rules.tag), function(req, res, next) {
		Model.renameAsync(req.params.id, req.body.name)
			 .then(function(tag) { res.json(tag); })
			 .catch(next);
	});

	router.delete('/tags/:id', validate(rules.id), function(req, res, next) {
		Model.deleteAsync(req.params.id)
			 .then(function() {
			 	res.sendStatus(204);
			 })
			 .catch(next);
	});
};