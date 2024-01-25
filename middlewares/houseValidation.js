const { body, validationResult } = require('express-validator');

exports.validateHouseRegistration = [
    body('broker_id').notEmpty().withMessage('Broker ID is required'),
    body('location').notEmpty().withMessage('location is required'),
    body('price').isFloat().withMessage('price is required'),
    body('no_of_rooms').isInt().withMessage('no_of_rooms must be an integer'),
    body('description').notEmpty().withMessage('description is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
];