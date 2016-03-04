module.exports = function(router) {
  	'use strict';

  	var Task = require('../models/task'),
  		rules = require('../validation'),
  		validate = require('express-validation');

	router.get('/tasks', function(req, res, next) {
		Task.find(function(err, tasks) {
			if (err) return next(err);

			res.json(tasks || []);
		});
	});

	router.get('/tasks/:id', validate(rules.id), function(req, res, next) {
		Task.findById(req.params.id, function(err, task) {
			if (err) return next(err);

			if (task)
				res.json(task);
			else
				res.sendStatus(404);
		});
	});

	router.post('/tasks', validate(rules.task), function(req, res, next) {
		var task = new Task(req.body);

		task.save(function(err) {
			if (err) return next(err);

			res.status(201).json(task);
		});
	});

	router.delete('/tasks/:id', validate(rules.id), function(req, res, next) {
		Task.findByIdAndRemove(req.params.id, function(err) {
			if (err) return next(err);

			return res.sendStatus(204);
		});
	});
};