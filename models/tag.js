'use strict';

var mixins = require('./mixins'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	tagSchema = new Schema({
		name: String
	});

mixins.extend(tagSchema);

module.exports = mongoose.model('Tag', tagSchema);