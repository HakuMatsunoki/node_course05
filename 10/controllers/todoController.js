const { catchAsync } = require('../utils');
const todoService = require('../services/todoService');

exports.createTodo = catchAsync(async (req, res) => {
  const newTodo = await todoService.createTodo(req.body, req.user);

  res.status(201).json({
    msg: 'Success',
    todo: newTodo,
  });
});

exports.getTodosList = catchAsync(async (req, res) => {
  const { todos, total } = await todoService.getTodosList(req.query, req.user);

  res.status(200).json({
    msg: 'Success',
    todos,
    total,
    user: req.user,
  });
});
