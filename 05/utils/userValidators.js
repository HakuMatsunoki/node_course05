const Joi = require('joi');

const { regex, userRolesEnum } = require('../constants');

exports.createUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(12).required(),
      year: Joi.number().min(1920).max(2023),
      email: Joi.string().email().required(),
      password: Joi.string().regex(regex.PASSWD_REGEX).required(),
      role: Joi.string().valid(...Object.values(userRolesEnum)),
    })
    .validate(data);
