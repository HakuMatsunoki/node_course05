const { model, Schema } = require('mongoose');
const { compare, genSalt, hash } = require('bcrypt');
const crypto = require('crypto');

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
      unique: true,
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
    avatar: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre save mongoose hook. Fires on "create" and "save"
userSchema.pre('save', async function(next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatar = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=monsterid`;
  }

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

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model('User', userSchema);

module.exports = User;
