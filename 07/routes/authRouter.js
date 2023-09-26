const { Router } = require('express');

const { authMiddleware } = require('../middlewares');
const { authController } = require('../controllers');

const router = Router();

router.post('/signup', authMiddleware.checkSignupUserData, authController.signup);
router.post('/login', authController.login);

module.exports = router;
