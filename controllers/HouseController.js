const { House, Image } = require("../models/houseModel")
const cloudinary = require("cloudinary")
const path = require("path")
const imagesDirectory = path.join(__dirname, "..", 'images');
const { Op } = require("sequelize")
const { sequelize } = require("sequelize")
const User = require("../models/userModel")

// cloudinary.config({
//     cloud_name: "dqdhs44nq",
//     api_key: "544857432499217",
//     api_secret: "MYbbMctHshdYR_3ELvkDpJLQx8o"
// })

// post new house
const postHouse = async (req, res) => {
  try {
    const { id } = req.params
    const { location, price, description, numberOfRoom } = req.body
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send("Files are missing");
    }
    const house = await House.create({
      location: location, numberOfRoom: numberOfRoom,
      price: price, description: description,rental_status:0,
      brokerId: id
    })

    const imagePaths = req.files.map(file => path.join(imagesDirectory, file.filename));
    const createdImages = await Promise.all(
      imagePaths.map(imageUrl => Image.create({ imageUrl, houseId: house.houseId }))
    );
    res.status(201).json({ "house": house, "images": createdImages })
  }
  catch (error) {
     // Handle validation errors
     if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => err.message);
      return res.status(400).json({ errors });
    }

    console.error('Error registering guarantor:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
}
}


// change house status

const changeHouseStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the house from the database
    const house = await House.findByPk(id);

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    // Toggle the rental_status of the house
    if (house.rental_status === 0) {
      house.rental_status = 1;
    } else {
      house.rental_status = 0;
    }

    await house.save();

    res.status(200).json({ message: 'House status updated successfully', house });
  } catch (err) {
    console.error('Error changing house status:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// edit house
const editHouse = async (req, res) => {
  try {
    const { houseId } = req.params
    const { numberOfRoom, description } = req.body
    const isValid = checkOwnership(houseId)
    if (isValid == false) {
      return res.json("unauthorized access")
    }
    isValid.numberOfRoom = numberOfRoom
    isValid.description = description
    await isValid.save()
    res.json(isValid)

  }
  catch (err) {
    console.log(err)
  }

}

// delete house
const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params
    // const isValid = checkOwnership(houseId)
    // if (!isValid) {
    //   return res.json("unauthorized access")
    // }

    const house = await House.findByPk(id, {
      include: Image
    });

    // Delete the house and associated images
    await house.destroy();

    res.json("success")

  }
  catch (err) {
    console.log(err)
  }

}

// check ownership for house
const checkOwnership = async (houseId) => {
  try {
    const { brokerId } = req.user
    const house = await House.findByPk(houseId)
    if (house.brokerId != brokerId) {
      return false
    }
    return house
  }
  catch (err) {
    console.log(err)
  }
}


// view single house details
const viewSingleHouse = async (req, res) => {
  try {
    const { houseId } = req.params
    const houseInfo = await House.findByPk(houseId, { include: Image })
    res.json(houseInfo)
  }
  catch (err) {
    console.log(err)
  }
}


// get all house 
const getAllHouses = async (req, res) => {
  try {

    const houseList = await House.findAll({ 
      where: {
        rental_status: 0,
      },
      include: Image })
    res.json(houseList)

  }
  catch (err) {
    console.log(err)
  }
}


// get all house based on user status  
const getAllUserBasedHouses = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the route parameter
    const user = await User.findByPk(userId);

    if (user.profile_status === 0) {
      // If the user's profile_status is 0, fetch all the houses
      const houseList = await House.findAll({
        where: {
          rental_status: 0,
        },
         include: Image
         });
      res.json(houseList);
    } else {
      // // If the user's profile_status is 1, find houses within their budget
      // const budget = user.budget; // Assuming the user's budget is stored in the 'budget' field

      // const houseList = await House.findAll({
      //   where: {
      //     price: {
      //       [Op.lte]: budget, // Filter houses with price less than or equal to the user's budget
      //     },
      //     rental_status: 0, // Filter houses with rental_status 0
      //   },
      //   include: Image,
      // });

      // res.json(houseList);


      // based on location house filter
      // If the user's profile_status is 1, find houses within 3km of the user's location
      const userLocation = JSON.parse(user.location); // Assuming the user's location is stored as a JSON string
      const { lat: userLat, lon: userLon } = userLocation;
      const budget = user.budget;
      let budgetVariation = budget * 0.3;

      const houseList = await House.findAll({
        where: {
              price: {
            [Op.lte]: budget + budgetVariation, // Filter houses with price less than or equal to the user's budget
          },
          rental_status: 0, // Filter houses with rental_status 0
        },
        include: [
          {
            model: Image,
            required: true, // Ensure the house has at least one image
          },
        ],
        order: [
          // Sort the houses by distance from the user's location
          [
            sequelize.literal(
              `(6371 * acos(cos(radians(${userLat})) * cos(radians(lat)) * cos(radians(lon) - radians(${userLon})) + sin(radians(${userLat})) * sin(radians(lat))))`
            ),
            'ASC',
          ],
        ],
        
      });

      res.json(houseList);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An error occurred while fetching houses.' });
  }
};

//   get house based on number of rooms

const getHousesBasedOnRooms = async (req, res) => {
  try {
    const userId = req.params.id;
    const no_of_rooms = req.body.numberOfRoom;
    const user = await User.findByPk(userId);

    if (user.profile_status === 0) {
      // If the user's profile_status is 0, fetch all the houses that match the number of rooms
      const houseList = await House.findAll({
        where: {
          numberOfRoom: no_of_rooms,
          rental_status: 0,
        },
        include: Image,
      });
      res.json(houseList);
    } else {
      // If the user's profile_status is 1, find houses that match either the budget or the number of rooms
      const budget = user.budget; // Assuming the user's budget is stored in the 'budget' field

      const houseList = await House.findAll({
        where: {
          [Op.and]: [
            {
              price: {
                [Op.lte]: budget, // Filter houses with price less than or equal to the user's budget
              },
            },
            {
              numberOfRoom: no_of_rooms, // Filter houses with number of rooms equal to the requested number
              rental_status: 0,
            },
          ],
        },
        include: Image,
      });
      console.log(houseList);
      res.json(houseList);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An error occurred while fetching houses.' });
  }
};

/* const searchHouse = async (req, res) => {
    const { brokerId } = req.user
    const { location } = re.query
    try {
        const house = await House.findAll({
            where: {
                brokerId: brokerId,
                location:
                    { [Op.iLike]: `%${location}%` }
            }
        })
        res.json(house)
    }
    catch (err) {
        res.json(err)
    }
} */

module.exports = { postHouse, editHouse, changeHouseStatus,deleteHouse, viewSingleHouse, getAllHouses, getHousesBasedOnRooms, getAllUserBasedHouses }

