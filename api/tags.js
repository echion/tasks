module.exports = function(router) {
  	'use strict';

  	var Tag = require('../models/tag'),
  		rules = require('../validation'),
  		validate = require('express-validation');

	router.get('/tags', function(req, res, next) {
		Tag.find(function(err, tags) {
			if (err) return next(err);

			res.json(tags || []);
		});
	});

	router.get('/tags/:id', validate(rules.id), function(req, res, next) {
		Tag.findById(req.params.id, function(err, tag) {
			if (err) return next(err);

			if (!tag) return res.sendStatus(404);

			res.json(tag);
		});
	});

	router.post('/tags', validate(rules.tag), function(req, res, next) {
		Tag.findOne(req.body, function(err, tag) {
			if (err) return next(err);

			if (tag)
				return res.json(tag);

			tag = new Tag(req.body);

			tag.save(function(err) {
				if (err) return next(err);

				res.status(201).json(tag);
			});
		});
	});

	router.put('/tags/:id', validate(rules.tag), function(req, res, next) {
		Tag.findByIdAndUpdate(req.params.id, { name: req.body.name }, function(err, tag) {
			if (err) return next(err);

			return res.json(tag);
		});
	});

	router.delete('/tags/:id', validate(rules.id), function(req, res, next) {
		Tag.findByIdAndRemove(req.params.id, function(err) {
			if (err) return next(err);

			return res.sendStatus(204);
		});
	});
};