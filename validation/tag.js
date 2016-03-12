var Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  params: {
  	id: Joi.objectId()
  },
  body: {
    name: Joi.string().required().max(50)
  }
};
