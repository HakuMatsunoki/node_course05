const Joi = require('joi');

exports.createUserDataValidator = (data) =>
  Joi
    .object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(12).required(),
      year: Joi.number().min(1920).max(2023),
    })
    .validate(data);
