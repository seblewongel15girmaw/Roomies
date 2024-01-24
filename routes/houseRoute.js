const express = require("express")
const { postHouse, editHouse, deleteHouse, getAllHouses, viewSingleHouse } = require("../controllers/HouseController")

const router = express.Router()

router.route("/posthouse").post(postHouse)
router.route("edithouse").put(editHouse)
router.route("deletehouse").delete(deleteHouse)
router.route("/getallhouse").get(getAllHouses)
router.route("/gethousedetail/:id").get(viewSingleHouse)

module.exports = router