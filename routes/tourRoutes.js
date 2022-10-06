const express = require('express');
const authController = require('./../controllers/authController');

const tourController = require(`./../controllers/tourController`);

const { getAllTours, getTour, createTour, updateTour, delelteTour } =
  tourController;

const router = express.Router();
//Middleware
//check id
// router.param('id', checkId);

///Routes
router.route('/top-5-cheap').get(tourController.aliasTopTours, getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/').get(authController.protect, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(delelteTour);
module.exports = router;
