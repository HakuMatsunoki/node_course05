const User = require('../models/userModel');
const { catchAsync } = require('../utils');

exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  newUser.password = undefined;

  res.status(201).json({
    msg: 'Success',
    user: newUser,
  });
});

exports.getUsers = catchAsync(async (req, res) => {
  // const users = await User.find().select('name email');
  // const users = await User.find().select('+password');
  // const users = await User.find().select('-email');
  const users = await User.find();

  res.status(200).json({
    msg: 'Success',
    users,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  res.status(200).json({
    msg: 'Success',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, year, role } = req.body;

  const updatedUser = await User.findByIdAndUpdate(id, { name, year, role }, { new: true });

  res.status(200).json({
    msg: 'Success',
    user: updatedUser,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  // res.status(200).json({
  //   msg: 'Success',
  // });
  res.sendStatus(204);
});
