var Joi = require('joi');


exports.task = require('./task');
exports.tag = require('./tag');
exports.result = require('./result');

exports.id = {
  params: {
    id: Joi.number().required()
  }
};

exports.removeTagFromResult = {
	params: {
		resultId: Joi.number().required(),
		tagId: Joi.number().required()
	}
};

exports.bodyIds = {
  body: Joi.array().items(Joi.number()).required()
};

