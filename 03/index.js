const express = require('express');
const uuid = require('uuid').v4;
const cors = require('cors');
const fs = require('fs').promises;

const app = express();

// use to have access to json in req body
app.use(express.json());
app.use(cors());

/**
 * CRUD - operations
 *
 * REST API ============================
 * HTTP requests methods:
 * POST         /users          - create user
 * GET          /users          - get all users
 * GET          /users/<userID> - get one user by ID
 * PUT/PATCH    /users/<userID> - update user data by ID
 * DELETE       /users/<userID> - delete user by ID
 */

// MIDDLEWARES ======================
// custom general middleware
app.use((req, res, next) => {
  console.log('Hello from middleware!!!');
  req.time = new Date().toLocaleString('uk-UA');

  next();
});

app.use('/users/:id', async (req, res, next) => {
  try {
    const users = JSON.parse(await fs.readFile('models.json'));

    const { id } = req.params;
    const user = users.find((item) => item.id === id);

    if (!user) {
      return res.status(404).json({
        msg: 'User does not exist..',
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);

    res.sendStatus(500);
  }
});

// CONTROLLERS ========================
app.get('/ping', (req, res) => {
  console.log(req.time);

  // res.sendStatus(200);
  // res.status(200).send('<h1>Hello from server!!</h1>');
  res.status(200).json({
    msg: 'pong!!',
  });
});

app.post('/users', async (req, res) => {
  try {
    const { name, year } = req.body;

    // :TODO add validation

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
  } catch (err) {
    console.log(err);

    res.sendStatus(500); // INTERNAL SERVER ERROR
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = JSON.parse(await fs.readFile('models.json'));

    res.status(200).json({
      msg: 'Success',
      users,
    });
  } catch (err) {
    console.log(err);

    res.sendStatus(500);
  }
});

// '/users/4aa2f710-bffa-4f13-b3f7-c5930325d5ee'
app.get('/users/:id', (req, res) => {
  const { user } = req;

  res.status(200).json({
    msg: 'Success',
    user,
  });
});

// app.patch('/users/:id', (req, res) => {});
// app.delete('/users/:id', (req, res) => {});

// SERVER ====================================
const port = 3000;

app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
