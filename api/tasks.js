'use strict';

module.exports = function(router) {
    var rules = require('../validation'),
        validate = require('express-validation'),
        Model = require('../models/task');

    router.get('/tasks', function(req, res, next) {
        Model.findAsync(req.query)
            .then(function(tasks) {
                res.json(tasks);
            })
            .catch(next);
    });

    router.get('/tasks/:id', validate(rules.id), function(req, res, next) {
        Model.findByIdAsync(req.params.id)
            .then(function(task) {
                res.json(task);
            })
            .catch(next);
    });

    router.post('/tasks', validate(rules.task), function(req, res, next) {
        Model.defineAsync(req.body)
            .then(function(task) {
                res.status(201).json(task);
            })
            .catch(next);
    });

    router.post('/tasks/:id/done', validate(rules.id), function(req, res, next) {
        Model.completeAsync(req.params.id)
            .then(function() {
                res.sendStatus(204);
            })
            .catch(next);
    });

    router.post('/tasks/:id/cancel', validate(rules.id), function(req, res, next) {
        Model.cancelAsync(req.params.id)
            .then(function() {
                res.sendStatus(204);
            })
            .catch(next);
    });

    router.delete('/tasks/:id', validate(rules.id), function(req, res, next) {
        Model.deleteAsync(req.params.id)
            .then(function() {
                res.sendStatus(204);
            })
            .catch(next);
    });
};