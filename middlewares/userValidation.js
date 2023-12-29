const { body, validationResult } = require('express-validator');

exports.validateUserRegistration = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').notEmpty().withMessage('email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('age').isInt({ min:0 }).withMessage('Invalid age'),
  body('budget').isInt({ min: 0 }).withMessage('Invalid budget'),
  body('image').optional(),
  body('personal_id').optional(),
  body('bio').notEmpty().withMessage('Bio is required'),
  body('phone_number').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('job_status').notEmpty().withMessage('Job status is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];