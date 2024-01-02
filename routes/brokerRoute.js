const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/brokerController');
const { validateBrokerRegistration } = require('../middlewares/brokerValidation');

router.get('/', brokerController.getAllBrokers);

router.post('/register', validateBrokerRegistration, brokerController.registerBroker);

router.put('/:id', validateBrokerRegistration, brokerController.updateBroker);
router.delete('/:id', brokerController.deleteBroker);

module.exports = router;