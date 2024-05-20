const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Create a new feedback
// router.post('/add-feedback/:user_id', feedbackController.createFeedback);
router.get('/', dashboardController.getDashboardStatus);
module.exports = router;