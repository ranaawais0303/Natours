const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

//for update user data filter function
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

////////////////////////////////////////
//set id of user to get user from new routes
//middleware
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
/////////////////////////////////////////
//Update current user
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create Error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update.Please use /updateMyPassword for this.',
        400
      )
    );
  }
  // 2)Filtered out unwanted fileds names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser,
    },
  });
});

////////////////////////////////////
//Delete current user his account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

////////////////////////////////////
//CREATE USER
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead',
  });
};

/////////////////////////////////
//GET ALL USERS
exports.getAllUsers = factory.getAll(User);
//GET SINGLE USER
exports.getUser = factory.getOne(User);
//DELELTE USER
exports.delelteUser = factory.deleteOne(User);
//UPDATE USER Do not update passwords with this
exports.updateUser = factory.updateOne(User);
