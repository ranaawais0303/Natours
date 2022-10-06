const jwt = require('jsonwebtoken');
const User = require('./../models/userModal');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

//from environment variable
const secret = process.env.JWT_SECRET;
const expireTime = process.env.JWT_EXPIRES_IN;
const signToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    secret,
    { expiresIn: expireTime }
  );
};
//SignUp User
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'Successs',
    token,
    data: {
      user: newUser,
    },
  });
});

//Login existing user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2)Check if user exist && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3)if everthing ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'Success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)Getting the token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in! please log in to get access.', 401)
    );
  }
  //2) Verification token

  //3)check if user still exists

  //4) Check if user changed password after the token was issued
  next();
});
