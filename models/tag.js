'use strict';

var mixins = require('./mixins'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	tagSchema = new Schema({
		name: String,
		normalizedName: String
	});

tagSchema.pre('save', function (next) {
	this.normalizedName = this.name.toLowerCase();
	next();
});

mixins.extend(tagSchema);

tagSchema.set('toJSON', {
	transform: function (doc, ret, options) {
		ret.id = ret._id;

		delete ret.normalizedName;
		delete ret._id;
		delete ret.__v;
	}
}); 

module.exports = mongoose.model('Tag', tagSchema);