'use strict';

var db = require('../db'),
    label = 'Task',
    taskStatuses = require('../models/task-statuses'),
    RuleError = require('./rule-error');

module.exports = {
    findByIdAsync: function(id) {
        return db.readAsync(id);
    },
    findAsync: function(predicate, any) {
        return db.findAsync(predicate || {}, any, label);
    },
    defineAsync: function(object) {
        object.status = taskStatuses.InProgress;

        return db.saveAsync(object, label);
    },
    completeAsync: function(id) {
        return db.readAsync(id)
                .then(function(task) {
                    if (task.status === taskStatuses.Cancelled)
                        throw new RuleError('A cancelled task may not be completed', 400);

                    task.status = taskStatuses.Completed;

                    return db.saveAsync(task);
                });
    },
    cancelAsync: function(id) {
        return db.readAsync(id)
                .then(function(task) {
                    if (task.status === taskStatuses.Completed)
                        throw new RuleError('A completed task may not be cancelled', 400);

                    task.status = taskStatuses.Cancelled;

                    return db.saveAsync(task);
                });
    },
    deleteAsync: function(id) {
        return db.deleteAsync(id, true);
    }
};