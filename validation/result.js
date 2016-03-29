var Joi = require('joi');

module.exports = {
  params: {
  	id: Joi.number()
  },
  body: {
    name: Joi.string().trim().required().max(250),
    completed: Joi.boolean().default(false),
    tags: Joi.array().items(Joi.number())
  }
};
