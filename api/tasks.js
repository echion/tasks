module.exports = function(router) {
  	'use strict';

  	var Task = require('../models/task'),
  		rules = require('../validation'),
  		validate = require('express-validation'),
  		taskStatuses = require('../models/task-statuses');

	router.get('/tasks', function(req, res, next) {
		Task.find(function(err, tasks) {
			if (err) return next(err);

			res.json(tasks || []);
		});
	});

	router.get('/tasks/:id', validate(rules.id), function(req, res, next) {
		Task.findById(req.params.id, function(err, task) {
			if (err) return next(err);

			if (!task) return res.sendStatus(404);

			res.json(task);
		});
	});

	router.post('/tasks', validate(rules.task), function(req, res, next) {
		var task = new Task(req.body);

		task.status = taskStatuses.InProgress;

		task.save(function(err) {
			if (err) return next(err);

			res.status(201).json(task);
		});
	});

	router.post('/tasks/:id/done', validate(rules.id), function(req, res, next) {
		Task.findByIdAndUpdate(req.params.id, { status: taskStatuses.Completed }, function(err) {
			if (err) return next(err);

			return res.sendStatus(204);
		});
	});

	router.post('/tasks/:id/cancel', validate(rules.id), function(req, res, next) {
		Task.findByIdAndUpdate(req.params.id, { status: taskStatuses.Cancelled }, function(err) {
			if (err) return next(err);

			return res.sendStatus(204);
		});
	});

	router.delete('/tasks/:id', validate(rules.id), function(req, res, next) {
		Task.findByIdAndRemove(req.params.id, function(err) {
			if (err) return next(err);

			return res.sendStatus(204);
		});
	});
};