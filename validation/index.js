var Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

exports.task = require('./task');
exports.id = {
  params: {
    id: Joi.objectId().required()
  }
};

