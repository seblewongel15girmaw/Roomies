const express = require("express")
const { viewProfile, createProfile, editProfile, signUp, signIn } = require("../controllers/brokerController")
const router = express.Router()


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"./images")
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)
    }
})
const upload = multer({ storage: storage });


router.route("/signup").post(signUp)
router.route("/login").post(signIn)

router.route("/getProfile/:id").get(viewProfile)
router.route("/createProfile").post(upload.single("image"),createProfile)
router.route("/editProfile/:id").put(editProfile)

module.exports=router