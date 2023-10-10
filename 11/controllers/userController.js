const { catchAsync } = require('../utils');
const { createUser, getAllUsers, getOneUser, updateUser, deleteUser, updateMe } = require('../services/userService');

/**
 * Create user controller
 * @category controllers
 * @author Sergii
 */
exports.createUser = catchAsync(async (req, res) => {
  // const { password, ...restUserData } = req.body;

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);
  // const isPasswordCorrect = await bcrypt.compare('Pass_1234', hashedPassword);

  // First way to create an object in DB
  // const newUser = await User.create({ ...restUserData, password: hashedPassword });

  // Second way to create an object in DB
  // const newUser = new User({ ...restUserData, password: hashedPassword });
  // await newUser.save();
  // newUser.name = newUser.name.toUpperCase();
  // await newUser.save();
  const newUser = await createUser(req.body);

  res.status(201).json({
    msg: 'Success',
    user: newUser,
  });
});

exports.getUsers = catchAsync(async (req, res) => {
  const users = await getAllUsers();

  res.status(200).json({
    msg: 'Success',
    users,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await getOneUser(req.params.id);

  res.status(200).json({
    msg: 'Success',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const updatedUser = await updateUser(req.params.id, req.body);

  res.status(200).json({
    msg: 'Success',
    user: updatedUser,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await deleteUser(req.params.id);

  res.sendStatus(204);
});

/**
 * Get logged in user data
 */
exports.getMe = (req, res) => {
  res.status(200).json({
    msg: 'Success',
    user: req.user,
  });
};

exports.updateMe = catchAsync(async (req, res) => {
  const updatedUser = await updateMe(req.body, req.user, req.file);

  res.status(200).json({
    msg: 'Success',
    user: updatedUser,
  });
});

exports.updateMyPassword = (req, res) => {
  res.status(200).json({
    msg: 'Success',
    user: req.user,
  });
};
