const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('././controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

console.log(process.env.NODE_ENV);
//1) GLOBAL MIDDLEWARES
//Set security HTTP headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  //show logging data into console
  app.use(morgan('dev'));
}

//limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

////express.json is middleware////
//Body parser, reading data form body into req.body
app.use(express.json({ limit: '10kb' }));

//Data Sanitization gainst NoSQL query injection i.e $gt:"",
app.use(mongoSanitize());

//Data sanitization against XSS
// app.use(xss);

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//Serving Static files
app.use(express.static(`${__dirname}/public`));

////custom middleware/////
// app.use((req, res, next) => {
//   console.log('Hello from middleware');
//   next();
// });

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', delelteTour);

//Mounting the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//unhandled url or route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//error handler middleware for all error
app.use(globalErrorHandler);

module.exports = app;
