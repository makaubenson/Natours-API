const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

//Method 2
// const {
//   getTour,
//   createTour,
//   updateTour,
//   deleteTour,
//   getAllTours,
// } = require('./../controllers/tourController');

const router = express.Router();

//Param Middleware
// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

//Method 1
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .post(tourController.createTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

//Method 2
// router.route('/').get(getAllTours).post(createTour);
// router
//   .route('/:id')
//   .get(getTour)
//   .post(createTour)
//   .patch(updateTour)
//   .delete(deleteTour);

module.exports = router;
