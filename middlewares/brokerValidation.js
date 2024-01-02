const { body, validationResult } = require('express-validator');


exports.validateBrokerRegistration = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').notEmpty().withMessage('email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('profile_pic').optional(),
  body('phone_number1').notEmpty().withMessage('Phone number1 is required'),
  body('phone_number2').notEmpty().withMessage('Phone number2 is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];