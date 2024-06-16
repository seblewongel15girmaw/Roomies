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
// router.post('/logout', authenticate,(req, res, next) => {
//     // console.log('Role in route handler:', req.role);
//     if (req.role === 'user') {
//         chatController.saveChatData(req, res, next);
//     } else {
//       return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
//     }
//   });

module.exports = router;