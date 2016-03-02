'use strict';

var mixins = require('./mixins'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	taskSchema = new Schema({
		name: String,
		description: String,
		status: Number
	});

mixins.extend(taskSchema);

module.exports = mongoose.model('Task', taskSchema);