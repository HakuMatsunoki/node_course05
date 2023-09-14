const uuid = require('uuid').v4;
const fs = require('fs').promises;

const { catchAsync, userValidators, AppError } = require('../utils');

exports.createUser = catchAsync(async (req, res) => {
  const { error, value } = userValidators.createUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  const { name, year } = value;

  const newUser = {
    name,
    year,
    id: uuid(),
  };

  // save user to DB
  const usersDB = await fs.readFile('models.json');

  const users = JSON.parse(usersDB);

  users.push(newUser);

  await fs.writeFile('models.json', JSON.stringify(users));

  res.status(201).json({
    msg: 'Success',
    user: newUser,
  });
});

exports.getUsers = catchAsync(async (req, res) => {
  const users = JSON.parse(await fs.readFile('models.json'));

  // if (users.length < 100) {
  // const err = new Error('Bad-bad error!!');

  // err.status = 501;

  // return next(err);

  // return next(new AppError(501, 'Bad bad errror!!!'));
  // }

  res.status(200).json({
    msg: 'Success',
    users,
  });
});

exports.getUser = (req, res) => {
  const { user } = req;

  res.status(200).json({
    msg: 'Success',
    user,
  });
};
