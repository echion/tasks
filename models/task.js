var mongoose = require('mongoose'),
	schema = mongoose.Schema({
		name: String,
		description: String,
		completed: Boolean
	}),
	Task = mongoose.model('Task', schema);

module.exports = Task;