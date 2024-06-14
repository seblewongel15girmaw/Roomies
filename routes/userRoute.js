
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const UserAuthController = require('../controllers/userAuthController');
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
router.post('/register', UserController.registerUser);

// verify user 
router.get('/verify', UserController.verifyEmail);


// user Login
router.post('/login', UserController.loginUser);

// Create User Profile
// router.post('/:id/profile', authenticate, upload.fields([{ name: 'image' }, { name: 'personal_id' }]), UserController.createUserProfile);
router.post('/:id/profile', authenticate,upload.fields([{ name: 'image' }, { name: 'personal_id' }]),(req, res, next) => {
  // console.log('Role in route handler:', req.role);
  if (req.role === 'user') {
    UserController.createUserProfile(req, res, next);
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
});

// Get All Users
router.get('/',authenticate, UserController.getAllUsers);

//  get single users
router.get('/:id', authenticate,(req, res, next) => {
  // console.log('Role in route handler:', req.role);
  if (req.role === 'user') {
    UserController.getUser(req, res, next);
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
});


// get all users
// router.get('/', authenticate, validateUserRegistration,(req, res, next) => {
//     console.log('Role in route handler:', req.role);
  
//     if (req.role === 'user') {
//       UserController.getAllUsers(req, res, next);
//     } else {
//       return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
//     }
//   });
  

// Update User Profile
router.put('/updated/:id', authenticate, UserController.updateUser);

// Delete User
router.delete('/:id', authenticate, UserController.deleteUser);

// change activate status
// router.post('/recommended_status_change/:id', UserController.recommendedStatus);
router.post('/recommended_status_change/:id', authenticate,(req, res, next) => {
  // console.log('Role in route handler:', req.role);
  if (req.role === 'user') {
    UserController.recommendedStatus(req, res, next);
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
});

//change payment status
// router.post("/change_payment_status/:userId", UserController.changePaymentStatus);
router.post('/change_payment_status/:userId', authenticate,(req, res, next) => {
  // console.log('Role in route handler:', req.role);
  if (req.role === 'user') {
    UserController.changePaymentStatus(req, res, next);
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
});

//get user status
// router.post("/getUser_status/:userId", UserController.getUserStatus);
router.get('/getUser_status/:userId', authenticate,(req, res, next) => {
  // console.log('Role in route handler:', req.role);
  if (req.role === 'user') {
    UserController.getUserStatus(req, res, next);
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
});

// forget password
router.post('/forget-password', UserAuthController.sendGeneratedPassword);

// change password
// router.post('/change-password/:id', authenticate, UserAuthController.changePassword);
router.post('/change-password/:id', authenticate,(req, res, next) => {
  // console.log('Role in route handler:', req.role);
  if (req.role === 'user') {
    UserController.changePassword(req, res, next);
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
});

module.exports = router;