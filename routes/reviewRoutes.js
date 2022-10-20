const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

//POST /tour/343j4343/reviews,, then merge params redirect this
//POST /reviews if this then no params use only main review use
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
