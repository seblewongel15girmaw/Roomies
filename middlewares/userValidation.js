const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');

exports.validateUserRegistration = [
  body('full_name')
    .notEmpty()
    .withMessage('Full name is required')
    .trim()
    .escape(),
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim()
    .escape()
    .custom(async (value) => {
      const user = await User.getUserByUsername(value);
      if (user) {
        return Promise.reject('Username is already taken');
      }
      return true;
    }),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.getUserByEmail(value);
      if (user) {
        return Promise.reject('Email is already registered');
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  body('religion')
    .optional()
    .isString()
    .withMessage('Religion must be a string'),
  body('age')
    .optional()
    .isInt({ min: 18, max: 120 })
    .withMessage('Age must be an integer between 18 and 120'),
  body('budget')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Budget must be an integer greater than or equal to 0'),
  body('image')
    .optional()
    .isString()
    .withMessage('Image must be a string'),
  body('personal_id')
    .optional()
    .isString()
    .withMessage('Personal ID must be a string'),
  body('bio')
    .optional()
    .isString()
    .withMessage('Bio must be a string'),
  body('phone_number')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object'),
  body('job_status')
    .optional()
    .isIn(['employed', 'unemployed', 'student', 'retired'])
    .withMessage('Invalid job status'),
  body('smoking')
    .optional()
    .isBoolean()
    .withMessage('Smoking must be a boolean value'),
  body('pets')
    .optional()
    .isBoolean()
    .withMessage('Pets must be a boolean value'),
  body('privacy')
    .optional()
    .isBoolean()
    .withMessage('Privacy must be a boolean value'),
  body('religious_compatibility')
    .optional()
    .isBoolean()
    .withMessage('Religious compatibility must be a boolean value'),
  body('socialize')
    .optional()
    .isBoolean()
    .withMessage('Socialize must be a boolean value'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];