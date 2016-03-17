var Joi = require('joi');

module.exports = {
  params: {
  	id: Joi.number()
  },
  body: {
    name: Joi.string().required(),
	notes: Joi.string(),
	priority: Joi.number(),
	dueBy: Joi.date(),
	scheduledFor: Joi.date(),
	assignedTo: Joi.string(),
	estimatedDuration: Joi.number(),
	actualDuration: Joi.number(),
	status: Joi.any().forbidden()
  }
};
