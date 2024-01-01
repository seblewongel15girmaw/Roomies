const express = require("express")
const { viewProfile, createProfile, editProfile } = require("../controllers/brokerController")

const router = express.Router()

router.route("/getProfile/:id").get(viewProfile)
router.route("/createProfile").post(createProfile)
router.route("/editProfile/:id").put(editProfile)

module.exports=router