const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');


// Register a User 
router.post('/register', AdminController.registerAdmin);
router.get('/', AdminController.getAllAdmins);
// admin login 
router.post('/login', AdminController.loginAdmin);

// Admin logout
router.post('/logout', AdminController.logoutAdmin);

module.exports = router;