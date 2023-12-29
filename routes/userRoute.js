const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserRegistration } = require('../middlewares/userValidation');

router.post('/register', validateUserRegistration, userController.registerUser);
router.get('/', userController.getAllUsers);


router.put('/:id', validateUserRegistration, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;