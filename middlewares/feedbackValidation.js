const { body, validationResult } = require('express-validator');

exports.validateFeedbackCreation = [
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt()
    .withMessage('User ID must be an integer'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('feedback_message')
    .notEmpty()
    .withMessage('Feedback message is required')
    .isString()
    .withMessage('Feedback message must be a string'),
  body('feedback_category')
    .notEmpty()
    .withMessage('Feedback category is required')
    .isString()
    .withMessage('Feedback category must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];