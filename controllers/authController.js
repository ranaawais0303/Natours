const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../../utils/AppError');
const sendEmail = require('./../utils/email');

//from environment variable
const secret = process.env.JWT_SECRET;
// const expireTime = process.env.JWT_EXPIRES_IN;
const signToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/////////////////////////////////////////
//Create and send token signin token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV.trim() === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  //Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'Successs',
    token,
    data: {
      user,
    },
  });
};

///////////////////////////////////////
//SignUp User
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);
});

////////////////////////////////////////////
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
  createSendToken(user, 200, res);
});

////////////////////////////////////////////
//protect tour data from unauthorized user
exports.protect = catchAsync(async (req, res, next) => {
  //1)Getting the token and check out it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! please log in to get access.', 401)
    );
  }

  //2) Verification token
  //about expiration of token
  const decoded = await promisify(jwt.verify)(token, secret);

  //3)check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please login again. ', 401)
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  console.log('You are in protect');
  req.user = currentUser;
  next();
});

//////////////////////////////////////
//Authorization who can delete tour
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin','lead-guide'] .role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Your do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

////////////////////////////////////
// FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }
  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  //3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassord}/${resetToken}`;

  const message = `Forgot your password?Submit a PATCH request
  with your new password and passwordConfirm to:${resetURL}.\n If you 
  didn't forgot your password,please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min) ',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token send to email ',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email, Try again later', 500)
    );
  }
});

/////////////////////////////////////////////
//Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on the token
  hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) update changedPasswordAt property for the user
  //check scheme pre save reset password update

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

//////////////////////////////////////////
//update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select('+password');
  // 2) Check if the POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('The current password is Wrong', 401));
  }

  // 3) If so,update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //User.findByIdAndUpdate woll not work as intended

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
