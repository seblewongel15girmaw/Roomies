const admin = require('./firebase-admin');

async function sendPushNotification(deviceToken, message) {
  try {
    const payload = {
      notification: {
        title: 'New User Recommended',
        body: message,
      },
    };

    await admin.messaging().sendToDevice(deviceToken, payload);
    console.log(`Push notification sent to device token: ${deviceToken}`);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

module.exports = {
  sendPushNotification,
};