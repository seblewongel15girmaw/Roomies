const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Create a new feedback
router.post('/add-feedback/:user_id', feedbackController.createFeedback);
// Get all feedbacks
// router.get('/', feedbackController.getAllFeedbacks);

module.exports = router;