const { body, validationResult } = require('express-validator');

exports.validateChatMessage = [
  body('sender_id').notEmpty().withMessage('Sender ID is required'),
  body('receiver_id').notEmpty().withMessage('Receiver ID is required'),
  body('image').optional(),
  body('message').optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];