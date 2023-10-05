const { Router } = require('express');

const viewController = require('../controllers/viewController');

const router = Router();

router.get('/home', viewController.home);
router.get('/todos', viewController.todos);

module.exports = router;
