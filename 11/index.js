const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './environments/production.env' : './environments/development.env',
});

const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');
const viewRouter = require('./routes/viewRouter');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// SET PUG TEMPLATE ENGINE =========
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MONGODB CONNECTION ==============
mongoose
  .connect(process.env.MONGO_URL)
  .then((con) => {
    console.log('Mongo DB successfully connected..');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// MIDDLEWARES ======================
// use to have access to json in req body
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// custom global middleware
app.use((req, res, next) => {
  console.log('Hello from middleware!!!');
  req.time = new Date().toLocaleString('uk-UA');

  next();
});

// CONTROLLERS ========================
app.get('/api/v1/ping', (req, res) => {
  console.log(req.time);

  // res.sendStatus(200);
  // res.status(200).send('<h1>Hello from server!!</h1>');
  res.status(200).json({
    msg: 'pong!!',
  });
});

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter);
app.use('/', viewRouter);

/**
 * Not found error handler.
 */
app.all('*', (req, res) => {
  res.status(404).json({
    msg: 'Oops! Recource not found..',
  });
});

/**
 * Global error handler. 4 args required!!!!!
 */
app.use((err, req, res, next) => {
  console.log('||==== ERRORRR =>>>>>>>>>>>');
  console.log(err);
  console.log('<<<<<<<<<<<=============||');

  res.status(err.status || 500).json({
    msg: err.message,
  });
});

// SERVER ====================================
const port = process.env.PORT || 7000;

module.exports = app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
