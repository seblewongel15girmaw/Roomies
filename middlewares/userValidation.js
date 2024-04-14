const { body, validationResult } = require('express-validator');

exports.validateUserRegistration = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').notEmpty().withMessage('email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
  
  
];