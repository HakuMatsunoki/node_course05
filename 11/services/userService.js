const { Types } = require('mongoose');
const crypto = require('crypto');

const User = require('../models/userModel');
const { AppError } = require('../utils');
const { userRolesEnum } = require('../constants');
const { signToken } = require('./jwtService');
const ImageService = require('./imageService');

/**
 * Create user service
 * @param {Object} userData
 * @returns {Promise<User>}
 * @category services
 * @author Sergii
 */
exports.createUser = async (userData) => {
  const newUser = await User.create(userData);

  newUser.password = undefined;

  return newUser;
};

/**
 * Get all users service
 * @returns {Promise<User[]>}
 */
exports.getAllUsers = () => User.find();
// const users = await User.find().select('name email');
// const users = await User.find().select('+password');
// const users = await User.find().select('-email');

/**
 * Get one user
 * @param {string} id
 * @returns {Promise<User>}
 */
exports.getOneUser = (id) => User.findById(id);

/**
 * Update user data service
 * @param {string} id
 * @param {Object} userData
 * @returns {Promise<User>}
 */
exports.updateUser = async (id, userData) => {
  const user = await User.findById(id);

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};

/**
 * Update logged in user data service
 */
exports.updateMe = async (userData, user, file) => {
  if (file) {
    // user.avatar = file.path.replace('public', '');
    user.avatar = await ImageService.save(file, { maxSize: 1.3, width: 500, height: 500 }, 'images', 'users', user.id);
  }

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};

/**
 * Delete user service
 * @param {string} id
 * @returns {Promise<void>}
 */
exports.deleteUser = (id) => User.findByIdAndDelete(id);

/**
 * Check user exists by id and id is valid mongodb id
 * @param {string} id
 * @returns {Promise<void>}
 */
exports.checkUserExistsById = async (id) => {
  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw new AppError(404, 'User not found..');

  const userExists = await User.exists({ _id: id });

  if (!userExists) throw new AppError(404, 'User not found..');
};

/**
 * Check user exists using filter object
 * @param {Object} filter
 * @returns {Promise<void>}
 */
exports.checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);

  if (userExists) throw new AppError(409, 'User exists..');
};

/**
 * Signup user and sign jwt
 * @param {Object} userData
 * @returns {Object} - user and jwt
 */
exports.signupUser = async (userData) => {
  const newUserData = {
    ...userData,
    role: userRolesEnum.USER,
  };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = signToken(newUser.id);

  return { user: newUser, token };
};

/**
 * Login and sign jwt
 * @param {Object} userData
 * @returns {Object} - user and jwt
 */
exports.loginUser = async (userData) => {
  // validate login data
  const user = await User.findOne({ email: userData.email }).select('+password');

  if (!user || !userData.password) throw new AppError(401, 'Not authorized');

  const passwordIsValid = await user.checkPassword(userData.password, user.password);

  if (!passwordIsValid) throw new AppError(401, 'Not authorized');

  user.password = undefined;

  const token = signToken(user.id);

  return { user, token };
};

exports.checkUserPasswords = async (userId, currentPassword, newPassword) => {
  const currentUser = await User.findById(userId).select('+password');

  if (!(await currentUser.checkPassword(currentPassword, currentUser.password))) {
    throw new AppError(401, 'Current password wrong..');
  }

  currentUser.password = newPassword;

  await currentUser.save();
};

exports.getUserByEmail = (email) => User.findOne({ email });

exports.resetPassword = async (otp, newPassword) => {
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedOtp,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError(400, 'Token is not valid');

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
};
