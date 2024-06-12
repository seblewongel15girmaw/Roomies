// var admin = require("firebase-admin");

// var serviceAccount = require('../config/serviceAccountKey.json');
// const certPath = admin.credential.cert(serviceAccount);
// admin.initializeApp({
//   credential: certPath
// });


// exports.sendPushNotification = (req, res, next ) => {
//     try {
//         let message = {
//             notification: {
//                 title: "Test Notification",
//                 body: "New user recommended for u"
//             },
//             data: {
//                 orderId: "123456",
//                 orderDate: "2022-10-28"
//             },
//             token: req.body.fcm_token
//         };

//         admin.messaging().send(message)
//             .then((response) => {
//                 return res.status(200).send({
//                     message: 'Notification sent'
//                 });
//             })
//             .catch((error) => {
//                 return res.status(500).send({
//                     message: error
//                 });
//             });
//     } catch (err) {
//         throw err;
//     }
// }