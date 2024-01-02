const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserRegistration } = require('../middlewares/userValidation');

router.get('/', userController.getAllUsers);
router.post('/register', validateUserRegistration, userController.registerUser);
router.put('/:id', validateUserRegistration, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;