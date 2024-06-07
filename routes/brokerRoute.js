
const express = require("express")
const multer=require("multer")
const { viewProfile, updateVerification,editProfile, verify,signup, signIn ,getAllBrokers} = require("../controllers/brokerController")
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

router.route("/signup").post(upload.single("image"),signup)
router.route("/verify").post(verify)

router.route("/login").post(signIn)

// get all brokers
router.route("/").get(getAllBrokers);



// verify brokers
// router.route("/verify-brokers/:id").post(updateVerification)


router.route("/getProfile/:id").get(viewProfile)
// router.route("/createProfile").post(upload.single("image"),createProfile)
router.route("/editProfile/:id").put(editProfile)

module.exports=router