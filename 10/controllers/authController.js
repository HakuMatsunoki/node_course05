const { catchAsync } = require('../utils');
const userService = require('../services/userService');

exports.signup = catchAsync(async (req, res) => {
  const { user, token } = await userService.signupUser(req.body);

  res.status(201).json({
    msg: 'Success',
    user,
    token,
  });
});

exports.login = catchAsync(async (req, res) => {
  const { user, token } = await userService.loginUser(req.body);

  res.status(200).json({
    user,
    token,
  });
});
