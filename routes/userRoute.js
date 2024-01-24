const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserRegistration } = require('../middlewares/userValidation');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, userController.getAllUsers);

router.post('/register', validateUserRegistration, userController.registerUser);
router.post('/login', userController.loginUser);

router.put('/:id',authenticate, validateUserRegistration, userController.updateUser);
router.delete('/:id',authenticate, userController.deleteUser);


module.exports = router;