const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middlewares/auth');


// Create a new feedback

router.get('/', dashboardController.getDashboardStatus);
// router.get('/', authenticate,(req, res, next) => {
//     if (req.role === 'admin') {
//         dashboardController.getDashboardStatus(req, res, next);
//     } else {
//       return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
//     }
//   });
module.exports = router;