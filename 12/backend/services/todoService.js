const { userRolesEnum } = require('../constants');
const Todo = require('../models/todoModel');

/**
 * Create todo in DB
 * @param {Object} newTodoData
 * @param {Object} owner
 * @returns {Promise<Todo>}
 */
exports.createTodo = (newTodoData, owner) => {
  const { title, description, due } = newTodoData;

  return Todo.create({
    title,
    description,
    due,
    owner,
  });
};

exports.getTodosList = async (filter, user) => {
  // const todos = await Todo.find().populate('owner');

  // SEARCH FEATURE ===============================
  // const todos = await Todo.find({ title: { $regex: filter.search, $options: 'i' } });

  const findOptions = filter.search
    ? {
      $or: [
        { title: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
      ],
    }
    : {};

  if (filter.search && user.role === userRolesEnum.USER) {
    for (const searchOption of findOptions.$or) searchOption.owner = user;
  }

  if (!filter.search && user.role === userRolesEnum.USER) {
    findOptions.owner = user;
  }

  // INITIALIZING DATABASE QUERY ====================
  const todosQuery = Todo.find(findOptions).populate({ path: 'owner', select: 'name email role' });

  // SORTING FEATURE ================================
  // order = 'ASC' | 'DESC'
  // .sort('title') | .sort('-description')
  todosQuery.sort(`${filter.order === 'DESC' ? '-' : ''}${filter.sort || 'title'}`);

  // PAGINATION FEATURE =============================
  // .limit(10) - limit of docs in DB response
  // .skip(10) - count of docs to skip

  // page 1 = limit 10, skip 0
  // page 2 = limit 10, skip 10
  // page 3 = limit 10, skip 20

  const paginationPage = filter.page ? +filter.page : 1;
  const paginationLimit = filter.limit ? +filter.limit : 5;
  const docsToSkip = (paginationPage - 1) * paginationLimit;

  todosQuery.skip(docsToSkip).limit(paginationLimit);

  const todos = await todosQuery;
  const total = await Todo.count(findOptions);

  return { todos, total };
};
