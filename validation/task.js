var Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  params: {
  	id: Joi.objectId()
  },
  body: {
    name: Joi.string().required(),
	notes: Joi.string(),
	priority: Joi.number(),
	dueBy: Joi.date(),
	scheduledFor: Joi.date(),
	categoryId: Joi.objectId(),
	assignedTo: Joi.objectId(),
	tags: Joi.array(),
	estimatedDuration: Joi.number(),
	actualDuration: Joi.number(),
	status: Joi.any().forbidden()
  }
};
