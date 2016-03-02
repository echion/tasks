'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	taskSchema = new Schema({
		name: String,
		description: String,
		status: Number
	});

taskSchema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
}); 

module.exports = mongoose.model('Task', taskSchema);