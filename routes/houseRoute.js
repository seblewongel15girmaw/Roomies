const express = require("express")
const { postHouse, editHouse, deleteHouse, getAllHouses, viewSingleHouse } = require("../controllers/HouseController")

const router = express.Router()

router.route("/posthouse").post(postHouse)
router.route("edithouse").put(editHouse)
router.route("deletehouse").delete(deleteHouse)
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