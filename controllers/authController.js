const jwt = require('jsonwebtoken');
const User = require('./../models/userModal');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  //from environment variable
  const secret = process.env.JWT_SECRET;
  const expireTime = process.env.JWT_EXPIRES_IN;

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwt.sign(
    {
      id: newUser._id,
    },
    secret,
    { expiresIn: expireTime }
  );
  res.status(201).json({
    status: 'Successs',
    token,
    data: {
      user: newUser,
    },
  });
});
