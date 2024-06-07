const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');


// Register a admins 
router.post('/register', AdminController.registerAdmin);

// get all admin
router.get('/', AdminController.getAllAdmins);

// admin login 
router.post('/login', AdminController.loginAdmin);

// Admin logout
router.post('/logout', AdminController.logoutAdmin);

module.exports = router;