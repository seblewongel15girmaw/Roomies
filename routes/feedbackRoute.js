const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authenticate = require('../middlewares/auth');
const validateFeedbacks  = require('../middlewares/feedbackValidation');


// Create a new feedback
router.post('/add-feedback/:user_id', feedbackController.createFeedback);
// router.post('/add-feedback/:user_id', authenticate,(req, res, next) => {
    
//     if (req.role === 'user') {
//         feedbackController.createFeedback(req, res, next);
//     } else {
//       return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
//     }
//   });
// get all feedbacks
router.get('/', feedbackController.getAllFeedbacks);
module.exports = router;