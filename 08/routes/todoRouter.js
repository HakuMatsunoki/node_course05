const { Router } = require('express');

const { protect } = require('../middlewares/authMiddleware');
const { createTodo, getTodosList } = require('../controllers/todoController');

const router = Router();

router.use(protect);

router.post('/', createTodo);
router.get('/', getTodosList);

module.exports = router;
