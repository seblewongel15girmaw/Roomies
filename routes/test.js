
const express = require('express');
const router = express.Router();
const Notification = require('../controllers/notification');
const { route } = require('./houseRoute');

router.post('/test-notification',Notification.sendPushNotification)

module.exports = router; 