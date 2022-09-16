const express = require('express');
const tourController = require('./../controllers/tourController');
const { getAllTours, getTour, createTour, updateTour, delelteTour, checkId } =
  tourController;

const router = express.Router();
//Middleware
router.param('id', checkId);
///Routes
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(delelteTour);
module.exports = router;
