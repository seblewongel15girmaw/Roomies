const { House, Image } = require("../models/houseModel")
const cloudinary = require("cloudinary")
const path = require("path")
const imagesDirectory = path.join(__dirname, "..", 'images');
const { Op } = require("sequelize")
const { Sequelize } = require("sequelize")

// cloudinary.config({
//     cloud_name: "dqdhs44nq",
//     api_key: "544857432499217",
//     api_secret: "MYbbMctHshdYR_3ELvkDpJLQx8o"
// })

// post new house
const postHouse = async (req, res) => {
    try {
        const { brokerId } = req.user
        const { location, price, description, numberOfRoom } = req.body
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).send("Files are missing");
        }
        const house = await House.create({
            location: location, numberOfRoom: numberOfRoom,
            price: price, description: description,
        })

        const imagePaths = req.files.map(file => path.join(imagesDirectory, file.filename));
        const createdImages = await Promise.all(
            imagePaths.map(imageUrl => Image.create({ imageUrl, houseId: house.houseId }))
        );
        res.json({ "house": house, "images": createdImages })
    }
    catch (err) {
        console.log(err)
    }
}


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
        const { houseId } = req.params
        const isValid = checkOwnership(houseId)
        if (!isValid) {
            return res.json("unauthorized access")
        }

        const house = await House.findByPk(houseId, {
            include: Image
        });

        // Delete the house and associated images
        await house.destroy();

        res.json(isValid)

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
        
        const houseList = await House.findAll({ include: Image })
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
        const houseList = await House.findAll({ include: Image });
        res.json(houseList);
      } else {
        // If the user's profile_status is 1, find houses within their budget
        const budget = user.budget; // Assuming the user's budget is stored in the 'budget' field
  
        const houseList = await House.findAll({
          where: {
            price: {
              [Op.lte]: budget, // Filter houses with price less than or equal to the user's budget
            },
          },
          include: Image,
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
            numberOfRoom: {
              [Op.lte]: no_of_rooms, // Filter houses with number of rooms less than or equal to the requested number
            },
          },
          include: Image,
        });
        res.json(houseList);
      } else {
        // If the user's profile_status is 1, find houses that match either the budget or the number of rooms
        const budget = user.budget; // Assuming the user's budget is stored in the 'budget' field
  
        const houseList = await House.findAll({
          where: {
            [Op.or]: [
              {
                price: {
                  [Op.lte]: budget, // Filter houses with price less than or equal to the user's budget
                },
              },
              {
                numberOfRoom: {
                  [Op.lte]: no_of_rooms, // Filter houses with number of rooms less than or equal to the requested number
                },
              },
            ],
          },
          include: Image,
        });
  
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

module.exports = { postHouse, editHouse, deleteHouse, viewSingleHouse, getAllHouses,getHousesBasedOnRooms,getAllUserBasedHouses}

