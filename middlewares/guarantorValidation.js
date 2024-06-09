const { body, validationResult } = require('express-validator');

exports.validateGuarantorRegistration = [
  body('user_id').notEmpty().withMessage('User ID is required').isInt().withMessage('User ID must be an integer'),
  body('full_name').notEmpty().withMessage('Full name is required').isString().withMessage('Full name must be a string'),
  body('personal_id').optional().isString().withMessage('Personal ID must be a string'),
  body('address').notEmpty().withMessage('Address is required').isString().withMessage('Address must be a string'),
  body('phone_number').notEmpty().withMessage('Phone number is required').isMobilePhone().withMessage('Phone number must be a valid mobile number'),
  body('gender').notEmpty().withMessage('Gender is required').isIn(['female', 'male']).withMessage('Gender must be either "female" or "male"'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];