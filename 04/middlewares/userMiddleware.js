const fs = require('fs').promises;

const { catchAsync, AppError } = require('../utils');

exports.checkUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (id.length < 10) {
    throw new AppError(400, 'Invalid ID');
  }

  const users = JSON.parse(await fs.readFile('models.json'));

  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new AppError(404, 'User not found..');
  }

  req.user = user;

  next();
});
