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

//update password
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

//Update other data except password
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

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
