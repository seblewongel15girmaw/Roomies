const { body, validationResult } = require('express-validator');
const Broker = require('../models/brokerModel');

exports.validateBrokerRegistration = [
  body('full_name')
    .notEmpty()
    .withMessage('Full name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value) => {
      const existingBroker = await Broker.getBrokerByEmail(value);
      if (existingBroker) {
        throw new Error('Email already exists');
      }
      return true;
    }),
  body('gender')
    .notEmpty()
    .withMessage('Gender is required'),
  body('address')
    .notEmpty()
    .withMessage('Address is required'),
  body('profile_pic')
    .optional(),
  body('phone_number1')
    .notEmpty()
    .withMessage('Phone number 1 is required')
    .custom(async (value) => {
      const existingBroker = await Broker.findOne({ where: { phone_number1: value } });
      if (existingBroker) {
        throw new Error('Phone number 1 already exists');
      }
      return true;
    }),
  body('phone_number2')
    .optional()
    .custom(async (value) => {
      if (value) {
        const existingBroker = await Broker.findOne({ where: { phone_number2: value } });
        if (existingBroker) {
          throw new Error('Phone number 2 already exists');
        }
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 100 })
    .withMessage('Password must be between 8 and 100 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];