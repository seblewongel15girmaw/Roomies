
const express = require("express")
const multer = require("multer")
const { viewProfile, editProfile, verify, signup, signIn, getAllBrokers } = require("../controllers/brokerController")
const router = express.Router()
const BrokerAuthController = require('../controllers/brokerAuthController');
const authenticate = require('../middlewares/auth');




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

// signup broker
router.route("/signup").post(upload.fields([{ name: 'profile_pic' }, { name: 'broker_personal_id' }]), signup)

// verify brokers phone number
router.route("/verify").post(verify)

router.route("/login").post(signIn)

// get all brokers
router.route("/").get(getAllBrokers);

// viewProfile 
// router.route("/getProfile/:id").get(authenticate, viewProfile)
router.get('/getProfile/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
   
      viewProfile(req, res, next);
   
  });

// edit profile
// router.route("/editProfile/:id").put(authenticate, editProfile)
router.put('/editProfile/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'broker') {
      editProfile(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });


// forget password
router.post('/forget_password', BrokerAuthController.sendGeneratedPassword);

// change passwor
// router.post('/change_password/:id',authenticate, BrokerAuthController.changePassword);
router.post('/change_password/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'broker') {
        BrokerAuthController.changePassword(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });


module.exports = router