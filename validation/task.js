var Joi = require('joi');

module.exports = {
  params: {
  	id: Joi.number()
  },
  body: {
    name: Joi.string().required().max(250),
	notes: Joi.string(),
	priority: Joi.number(),
	dueBy: Joi.date(),
	scheduledFor: Joi.date(),
	estimatedDuration: Joi.number(),
	actualDuration: Joi.number(),
	status: Joi.any().forbidden()
  }
};
