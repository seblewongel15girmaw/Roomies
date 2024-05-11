
const express = require("express")
const multer=require("multer")
const { viewProfile, createProfile, editProfile, signUp, signIn ,getAllBrokers} = require("../controllers/brokerController")
const router = express.Router()
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

// get all brokers
router.route("/").get(getAllBrokers);


router.route("/signup").post(validateBrokerRegistration, signUp)
router.route("/login").post(signIn)

router.route("/getProfile/:id").get(viewProfile)
router.route("/createProfile").post(upload.single("image"),createProfile)
router.route("/editProfile/:id").put(editProfile)

module.exports=router