'use strict';

var mixins = require('./mixins'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	taskSchema = new Schema({
		name: String,
		notes: String,
		priority: Number,
		dueBy: Date,
		scheduledFor: Date,
		categoryId: Schema.Types.ObjectId,
		assignedTo: Schema.Types.ObjectId,
		tags: [Schema.Types.ObjectId],
		estimatedDuration: Number,
		actualDuration: Number,
		status: Number
	});

mixins.extend(taskSchema);

module.exports = mongoose.model('Task', taskSchema);