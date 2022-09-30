const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  console.log('HandleCastError');
  const message = `Invalid ${err.path}:${err.value}`;
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
    console.log(err.isOperational);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //Programming or other unknown error:don't leake error details
  else {
    //1)log Error
    console.error('ERROR💥', err);
    console.log(err.isOperational);

    //2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  process.env.NODE_ENV.replace(' ', '');

  console.log('start from here');
  console.log('startggggg', process.env.NODE_ENV);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('development');
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production ') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(error, res);
  }
};
