const express = require('express');
const authController = require('./../controllers/authController');

const tourController = require(`./../controllers/tourController`);
const reviewRouter = require('./../routes/reviewRoutes');
const { getAllTours, getTour, createTour, updateTour, deleteTour } =
  tourController;

const router = express.Router();
//Middleware
//check id
// router.param('id', checkId);

//POST /tour/343j4343/reviews
//GET /tour/343j4343/reviews

router.use('/:tourId/reviews', reviewRouter);

///Routes
router.route('/top-5-cheap').get(tourController.aliasTopTours, getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    createTour
  );
router
  .route('/:id')
  .get(getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
