const express = require("express")
const { postHouse, editHouse, deleteHouse, getAllHouses, getAllUserBasedHouses, viewSingleHouse, getHousesBasedOnRooms } = require("../controllers/HouseController")
const {getAllBrokerHouse}= require("../controllers/brokerController")
const multer = require("multer")
const authenticate = require('../middlewares/auth');
const validateHouseRegistration  = require('../middlewares/houseValidation');



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


// post new house
// router.route("/posthouse/:id").post(upload.array("images", 6),postHouse)
router.post('/posthouse/:id', authenticate,upload.array("images", 6),(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'broker') {
        postHouse(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });


// edit house
// router.route("/edithouse").put(editHouse)
router.put('/edithouse/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'broker') {
        editHouse(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });

// delete house 
// router.route("/deletehouse/:id").delete(deleteHouse)
router.delete('/deletehouse/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'broker') {
        deleteHouse(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });

// get all house based on user profile status
// router.route("/getallhouse/:id").get(getAllUserBasedHouses)
router.get('/getallhouse/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        getAllUserBasedHouses(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });


//   just get all house
// router.route("/all_broker_house").get(getAllBrokerHouse);
router.get('/all_broker_house/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        getAllBrokerHouse(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });

// get all house based on number of rooms
// router.route("/get_all_house_room_based/:id").get(getHousesBasedOnRooms)
router.get('/get_all_house_room_based/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        getHousesBasedOnRooms(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });

// just get all house
router.route("/getallhouse").get(getAllHouses)


// router.route("/gethousedetail/:id").get(viewSingleHouse)
router.get('/gethousedetail/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        viewSingleHouse(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });

module.exports = router



