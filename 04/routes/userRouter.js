const { Router } = require('express');

const { userController } = require('../controllers');
const { userMiddleware } = require('../middlewares');

const router = Router();

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

// router.post('/', userController.createUser);
// router.get('/', userController.getUsers);
// router.get('/:id', userMiddleware.checkUserId, userController.getUser);
// router.patch('/:id', userMiddleware.checkUserId, userController.getUser);
// router.delete('/:id', userMiddleware.checkUserId, userController.getUser);

router
  .route('/')
  .post(userController.createUser)
  .get(userController.getUsers);

router.use('/:id', userMiddleware.checkUserId);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.getUser)
  .delete(userController.getUser);

module.exports = router;
