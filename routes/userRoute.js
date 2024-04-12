
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateUserRegistration } = require('../middlewares/userValidation');
const authenticate = require('../middlewares/auth');
const multer = require("multer")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });


// Register a User 
router.post('/register',validateUserRegistration,UserController.registerUser);

// user Login
router.post('/login', UserController.loginUser);


// Create User Profile
router.post('/:id/profile', authenticate, upload.fields([{ name: 'image' }, { name: 'personal_id' }]) ,UserController.createUserProfile);

// Get All Users
router.get('/', UserController.getAllUsers);

// Update User Profile
router.put('/updated/:id',authenticate, UserController.updateUser);

// Delete User
router.delete('/:id',authenticate, UserController.deleteUser);

module.exports = router;