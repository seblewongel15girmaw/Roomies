
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateUserRegistration } = require('../middlewares/userValidation');
const authenticate = require('../middlewares/auth');

// Register a User 
router.post('/register', UserController.registerUser);

// user Login
router.post('/login', UserController.loginUser);


// Create User Profile
router.post('/:id/profile', authenticate,UserController.createUserProfile);

// Get All Users
router.get('/',authenticate, UserController.getAllUsers);

// Update User Profile
router.put('/updated/:id',authenticate, UserController.updateUser);

// Delete User
router.delete('/:id', authenticate,UserController.deleteUser);

module.exports = router;