const express = require('express');
const tourControllers = require('../controllers/tourControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

// >>> Tours
router
 .route('/top-4-expensive')
 .get(tourControllers.aliasTopTours , tourControllers.getAllTours);

router
  .route('/tours-stats')
  .get(tourControllers.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(tourControllers.getMonthlyPlan);

router
  .route('/get-trip-size')  
  .get(tourControllers.getTripSize);

router
  .route('/')
  .get(authControllers.protect , tourControllers.getAllTours)
  .post(tourControllers.createTour);
  // authControllers.restrictTo('admin' , 'lead-guid')
router
  .route('/:id')
  .get(tourControllers.getTour)
  .delete(authControllers.protect ,tourControllers.deleteTour)
  .patch(tourControllers.updateTour);

module.exports = router;
