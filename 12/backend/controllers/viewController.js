const Todo = require('../models/todoModel');
const { catchAsync } = require('../utils');

exports.home = (req, res) => {
  res.status(200).render('home', {
    title: 'Todos Home',
    active: 'home',
  });
};

exports.todos = catchAsync(async (req, res) => {
  const todos = await Todo.find().populate('owner');

  res.status(200).render('todos', {
    title: 'Todos List',
    active: 'todos',
    todos,
  });
});
