
const express = require("express")
const multer=require("multer")
const { viewProfile,editProfile, verify,signup, signIn ,getAllBrokers} = require("../controllers/brokerController")
const router = express.Router()
const BrokerAuthController = require('../controllers/brokerAuthController');

const { validateBrokerRegistration } = require('../middlewares/brokerValidation')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"./images")
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)
    }
})
const upload = multer({ storage: storage });

// signup broker
router.route("/signup").post(upload.fields([{ name: 'profile_pic' }, { name: 'broker_personal_id' }]),signup)

// verify brokers phone number
router.route("/verify").post(verify)

router.route("/login").post(signIn)

// get all brokers
router.route("/").get(getAllBrokers);

// viewProfile 
router.route("/getProfile/:id").get(viewProfile)

// edit profile
router.route("/editProfile/:id").put(editProfile)


// forget password
router.post('/forget_password', BrokerAuthController.sendGeneratedPassword);

// change password
router.post('/change_password/:id', BrokerAuthController.changePassword);

module.exports=router