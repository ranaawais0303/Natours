const Review = require('./../models/reviewModel');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

//middleware for set user and tour id
exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  //get req.user from protect middleware
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//////////////////////////////////////////
//Get All reviews
exports.getAllReviews = factory.getAll(Review);
//Get Reviews
exports.getReview = factory.getOne(Review);
//Create new Reviews
exports.createReview = factory.createOne(Review);
//Delete review
exports.deleteReview = factory.deleteOne(Review);
//Update review
exports.updateReview = factory.updateOne(Review);
