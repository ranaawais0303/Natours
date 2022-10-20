const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

//Get All reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'Success',

    results: reviews.length,
    data: {
      reviews,
    },
  });
});

//middleware for set user and tour id
exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  //get req.user from protect middleware
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//Create new Reviews
exports.createReview = factory.createOne(Review);
//Delete review
exports.deleteReview = factory.deleteOne(Review);
//Update review
exports.updateReview = factory.updateOne(Review);
