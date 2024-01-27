

const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/brokerController');
const { validateBrokerRegistration } = require('../middlewares/brokerValidation');

router.get('/', brokerController.getAllBrokers);

router.post('/register', validateBrokerRegistration, brokerController.registerBroker);

router.put('/:id', validateBrokerRegistration, brokerController.updateBroker);
router.delete('/:id', brokerController.deleteBroker);

module.exports = router;


// const express = require("express")
// const { viewProfile, createProfile, editProfile, signUp, signIn } = require("../controllers/brokerController")
// const router = express.Router()


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null,"./images")
//     },
//     filename: (req, file, cb) => {
//         cb(null,file.originalname)
//     }
// })
// const upload = multer({ storage: storage });


// router.route("/signup").post(signUp)
// router.route("/login").post(signIn)

// router.route("/getProfile/:id").get(viewProfile)
// router.route("/createProfile").post(upload.single("image"),createProfile)
// router.route("/editProfile/:id").put(editProfile)

// module.exports=router