const express =  require('express');
const reviewControllers = require('../controllers/reviewControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

// reviews
router.route('/')
    .get(reviewControllers.getAllReviews)
    .post(authControllers.protect , reviewControllers.createReview)

module.exports = router