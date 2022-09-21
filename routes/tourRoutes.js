const express = require('express');
const tourController = require('./../controllers/tourController');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  delelteTour,
  checkId,
  checkBody,
} = tourController;

const router = express.Router();
//Middleware
//check id
router.param('id', checkId);

///Routes
router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(delelteTour);
module.exports = router;