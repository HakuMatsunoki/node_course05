const { model, Schema } = require('mongoose');
const { compare, genSalt, hash } = require('bcrypt');

const { userRolesEnum } = require('../constants');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'Duplicated email..'],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    year: Number,
    role: {
      type: String,
      // enum: ['admin', 'user', 'moderator'],
      enum: Object.values(userRolesEnum),
      default: userRolesEnum.USER,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre save mongoose hook. Fires on "create" and "save"
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});

/**
 * Custom mongoose method to validate password.
 * @param {string} candidate
 * @param {string} passwordHash
 * @returns {Promise<boolean>}
 */
userSchema.methods.checkPassword = (candidate, passwordHash) => compare(candidate, passwordHash);

const User = model('User', userSchema);

module.exports = User;
