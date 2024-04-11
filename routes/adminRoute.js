const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');


// Register a User 
router.post('/register', AdminController.registerAdmin);
router.get('/', AdminController.getAllAdmins);


module.exports = router;