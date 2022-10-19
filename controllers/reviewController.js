const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

//Get All reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'Success',
    data: {
      reviews,
    },
  });
});

//Creating new Reviews
exports.createReview = catchAsync(async (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  //get req.user from protect middleware
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      review: newReview,
    },
  });
});
