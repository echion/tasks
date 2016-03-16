var Joi = require('joi');

module.exports = {
  params: {
  	id: Joi.number()
  },
  body: {
    name: Joi.string().required().max(50)
  }
};
