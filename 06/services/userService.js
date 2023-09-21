const { Types } = require('mongoose');

const User = require('../models/userModel');
const { AppError } = require('../utils');

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
