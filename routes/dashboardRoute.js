const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Create a new feedback

router.get('/', dashboardController.getDashboardStatus);
module.exports = router;