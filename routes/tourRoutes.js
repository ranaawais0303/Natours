const express = require('express');

const tourController = require(`./../controllers/tourController`);

const { getAllTours, getTour, createTour, updateTour, delelteTour } =
  tourController;

const router = express.Router();
//Middleware
//check id
// router.param('id', checkId);

///Routes
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, getAllTours)
  .post(createTour);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(delelteTour);
module.exports = router;
