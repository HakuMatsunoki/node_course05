const { Router } = require('express');

const { authMiddleware } = require('../middlewares');
const { authController } = require('../controllers');

const router = Router();

router.post('/signup', authMiddleware.checkSignupUserData, authController.signup);
router.post('/login', authController.login);

// 1. send restore password request with user email => https://yoursite.com/restorepass/<one-time-passwd>
router.post('/forgot-password', authController.forgotPassword);

// 2. update user password using password restore token
router.patch('/restore-password/:otp', authController.restorePassword);

module.exports = router;
