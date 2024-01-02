const express = require('express');
const router = express.Router();
const guarantorController = require('../controllers/guarantorController');
const { validateGuarantorRegistration } = require('../middlewares/guarantorValidation');

router.get('/', guarantorController.getAllGuarantor);
router.post('/register', validateGuarantorRegistration, guarantorController.registerGuarantor);
router.put('/:id', validateGuarantorRegistration, guarantorController.updateGuarantor);
router.delete('/:id', guarantorController.deleteGuarantor);

module.exports = router;