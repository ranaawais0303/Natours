const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  console.log('HandleCastError');
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handlerDuplicateFieldDB = (err) => {
  console.log('this is duplication of error');
  const message = `Duplicate field value:${err.keyValue.name} is Already in use`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data. ${error.join('. ')}`;
  return new AppError(message, 400);
};
//For development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
//for production
const sendErrorProd = (err, res) => {
  //Operational,trusted error:send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //Programming or other unknown error:don't leake error details
  else {
    //1)log Error
    console.error('ERROR💥', err);
    // console.log(err.isOperational);

    //2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log('start from here');
  // console.log('startggggg', process.env.NODE_ENV);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('development');
    console.log(err.name);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    // let error = { ...err };

    let error = err;

    //for id
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    //for name
    if (error.code === 11000) error = handlerDuplicateFieldDB(error);
    // sendErrorProd(error, res);
    if (error.name === 'ValidationError') {
      // console.log('errorObj.name', errorObj.name);
      error = handleValidationErrorDB(error);
    }
    sendErrorProd(error, res);
  }
};
