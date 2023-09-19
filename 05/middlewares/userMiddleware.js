const { Types } = require('mongoose');

const User = require('../models/userModel');
const { catchAsync, AppError, userValidators } = require('../utils');

exports.checkUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw new AppError(404, 'User not found..');

  const userExists = await User.exists({ _id: id });
  // const user = await User.findById(id);

  if (!userExists) {
    throw new AppError(404, 'User not found..');
  }

  // req.user = user;

  next();
});

exports.checkCreateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidators.createUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  const userExists = await User.exists({ email: value.email });

  if (userExists) throw new AppError(409, 'User with this email already exists..');

  req.body = value;

  next();
});
