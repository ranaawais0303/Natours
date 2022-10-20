const express = require('express');

const userController = require(`./../controllers/userController`);
const authController = require(`./../controllers/authController`);
//3) ROUTES

const router = express.Router();

//authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);
//Reset/forgot password
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Protect all routes after this middleware
router.use(authController.protect);

//update password
router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
//Update other data except password
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

//restrictTo all routes after this middleware
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.delelteUser);

module.exports = router;
