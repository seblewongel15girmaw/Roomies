const { body, validationResult } = require('express-validator');

exports.validateGuarantorRegistration = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  // body('user_id').notEmpty().withMessage('User ID is required'),
  // body('user_id').isInt().withMessage('User ID must be an integer'),
  body('personal_id_image').optional(),
  body('address').notEmpty().withMessage('Address is required'),
  body('phone_number').notEmpty().withMessage('Phone number is required'),
  body('gender').notEmpty().withMessage('Gender is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];