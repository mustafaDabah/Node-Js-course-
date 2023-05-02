const express = require('express');
const tourControllers = require('../controllers/tourControllers');
const authControllers = require('../controllers/authControllers');
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// router
//   .route('/:tourId/reviews')
//   .post(authControllers.protect, authControllers.restrictTo('user'), reviewControllers.createReview)

// >>> Tours
// tours/:tourId/reviews/ make the merge params. 
router.use('/:tourId/reviews', reviewRouter);

router
 .route('/top-4-expensive')
 .get(tourControllers.aliasTopTours , tourControllers.getAllTours);

router
  .route('/tours-stats')
  .get(tourControllers.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(authControllers.protect, authControllers.restrictTo('admin', 'lead-guide') ,tourControllers.getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getToursWithin)

router
  .route('/distances/:latlng/unit/:unit')
  .get(tourControllers.getDistances);
  
router
  .route('/get-trip-size')  
  .get(tourControllers.getTripSize);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(authControllers.protect, authControllers.restrictTo('admin', 'lead-guide') ,tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTour)
  .delete(authControllers.protect, authControllers.restrictTo('admin', 'lead-guide'), tourControllers.deleteTour)
  .patch(authControllers.protect, authControllers.restrictTo('admin', 'lead-guide'), tourControllers.updateTour);

module.exports = router;
