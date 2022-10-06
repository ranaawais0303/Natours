const User = require('./../models/userModal');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

//GET ALL USERS
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

//GET SINGLE USER
exports.getUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//CREATE USER
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//DELELTE USER
exports.delelteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//UPDATE USER
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
