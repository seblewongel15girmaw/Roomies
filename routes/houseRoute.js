const express = require("express")
const { postHouse, editHouse, deleteHouse, getAllHouses, getAllUserBasedHouses,viewSingleHouse,getHousesBasedOnRooms } = require("../controllers/HouseController")
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


const router = express.Router()

router.route("/posthouse").post(upload.array("images", 6),postHouse)
router.route("edithouse").put(editHouse)
router.route("deletehouse").delete(deleteHouse)


// get all house based on user profile
router.route("/getallhouse/:id").get(getAllUserBasedHouses)

// get all house based on number of rooms
router.route("/get_all_house_room_based/:id").get(getHousesBasedOnRooms)


// just get all house
router.route("/getallhouse").get(getAllHouses)




router.route("/gethousedetail/:id").get(viewSingleHouse)

module.exports = router



// const express = require('express');
// const router = express.Router();
// const houseController = require('../controllers/HouseController');
// const { validateHouseRegistration } = require('../middlewares/houseValidation');

// router.get('/', houseController.getAllHouse);
// router.post('/register', validateHouseRegistration, houseController.registerHouse);
// router.get('/:id', houseController.getHouseById);
// router.delete('/:id', houseController.deleteHouse);
// router.put('/:id',validateHouseRegistration, houseController.updateHouse);

// module.exports = router;