module.exports = function(router) {
  	'use strict';

  	var Tag = require('../models/tag'),
  		Result = require('../models/result'),
  		rules = require('../validation'),
  		validate = require('express-validation');

	router.get('/results/:id/tags', function(req, res, next) {
		Tag.findByResultIdAsync(req.params.id)
			 .then(function(tags) { 
			 	res.json(tags); 
			 })
			 .catch(next);
	});

	router.put('/results/:id/tags', validate(rules.bodyIds), function(req, res, next) {
		Result.updateTagsAsync(req.params.id, req.body)
			 .then(function(tag) { 
			 	res.sendStatus(204);
			 })
			 .catch(next);
	});

	router.delete('/results/:resultId/tags/:tagId', validate(rules.removeTagFromResult), 
		function(req, res, next) {
			Result.removeTagAsync(req.params.resultId, req.params.tagId)
				   .then(function() {
				 	  res.sendStatus(204);
				   })
				   .catch(next);
		});
};