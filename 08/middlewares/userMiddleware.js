const { checkUserExistsById, checkUserExists } = require('../services/userService');
const { catchAsync, AppError, userValidators } = require('../utils');

/**
 * Check user exists by id and id is valid mongodb id.
 * @category middlewares
 * @author Sergii
 */
exports.checkUserId = catchAsync(async (req, res, next) => {
  await checkUserExistsById(req.params.id);

  next();
});

exports.checkCreateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidators.createUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  await checkUserExists({ email: value.email });

  req.body = value;

  next();
});

exports.checkUpdateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidators.updateUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  await checkUserExists({ email: value.email, _id: { $ne: req.params.id } });

  req.body = value;

  next();
});
