const { House, Image } = require("../models/houseModel")
const cloudinary = require("cloudinary")
const path = require("path")
const imagesDirectory = path.join(__dirname, "..", 'images');
const { Op } = require("sequelize")
// const { sequelize } = require("sequelize")
const sequelize = require('../config/dbConfig');
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
  const { id } = req.params; // Extract house ID from request parameters
  const { location, price, description, numberOfRoom } = req.body; // Extract updated house details from request body
  const files = req.files; // Uploaded files (if any)

  try {
    // Check if files are missing
    if (!files || files.length === 0) {
      return res.status(400).send("Files are missing");
    }

    // Update the house details in the database
    const updatedHouse = await House.findByPk(id); // Find the house by its primary key (id)
    
    // Handle if the house with the given id does not exist
    if (!updatedHouse) {
      return res.status(404).json({ message: 'House not found' });
    }

    // Perform the update
    updatedHouse.location = location;
    updatedHouse.price = price;
    updatedHouse.description = description;
    updatedHouse.numberOfRoom = numberOfRoom;
    
    // Save the updated house details
    await updatedHouse.save();

    // Update or add images
    const imagePaths = req.files.map(file => path.join(imagesDirectory, file.filename)); // Assuming imagesDirectory is defined
    const updatedImages = await Promise.all(
      imagePaths.map(imageUrl => Image.create({ imageUrl, houseId: updatedHouse.houseId }))
    );

    // Respond with updated house and images
    // res.json({ house: updatedHouse, images: updatedImages });
    res.status(201).json({ house: updatedHouse, images: updatedImages });
  } catch (error) {
    // Handle errors
    console.error('Error editing house:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


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
    res.status(201).json('deleted successfully')


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

// get all house based on user status  
// const getAllUserBasedHouses = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findByPk(userId);
//     console.log('user:', user);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.profile_status === 0) {
//       const houseList = await House.findAll({
//         where: {
//           rental_status: 0,
//         },
//         include: Image,
//       });
//       return res.json(houseList);
//     } else {
   
// const address = '{"display_name":"Lafto, Lafto Condominiums, ላፍቶ, Nefas Silk, አዲስ አበባ / Addis Ababa, አዲስ አበባ, 0006, ኢትዮጵያ","lat":8.95,"lon":38.75}';
//       const Paddress = JSON.parse(address);

//       console.log('lan1:',Paddress.lat)
//       console.log('lon1:',Paddress.lon)


      

      
//       const budgetVariation = 0.3 * user.budget;

//       const houseList = await House.findAll({
//         where: {
//           price: {
//             [Op.lte]: user.budget + budgetVariation,
//           },
//           rental_status: 0,
//         },
//         include: [
//           {
//             model: Image,
//             required: true,
//           },
//         ],
//         order: [
//           [
//             sequelize.literal(`
//             (6371 * acos(
//               cos(radians(${Paddress.lat})) * cos(radians(lat)) * cos(radians(lon) - radians(${Paddress.lon})) +
//               sin(radians(${Paddress.lat})) * sin(radians(lat))
//             ))
//           `),
//             'ASC',
//           ],
//         ],
//       });

//       return res.json(houseList);
//     }
//   } catch (err) {
//     console.error('Error fetching houses:', err);
//     return res.status(500).json({
//       error: {
//         code: 500,
//         message: 'An error occurred while fetching houses.',
//         details: err.message,
//       },
//     });
//   }
// };
const getAllUserBasedHouses = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    // console.log('user:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.profile_status === 0) {
      const houseList = await House.findAll({
        where: {
          rental_status: 0,
        },
        include: [Image],
      });
      return res.json(houseList);
    } else {
      // const address = '{"display_name":"Lafto, Lafto Condominiums, ላፍቶ, Nefas Silk, አዲስ አበባ / Addis Ababa, አዲስ አበባ, 0006, ኢትዮጵያ","lat":8.95,"lon":38.75}';
      const userAddress = JSON.parse(user.address);

      console.log('Lat:', userAddress.lat);
      console.log('Lon:', userAddress.lon);

      const budgetVariation = 0.3 * user.budget;

      const houseList = await House.findAll({
        where: {
          price: {
            [Op.lte]: user.budget + budgetVariation,
          },
          rental_status: 0,
        },
        include: [
          {
            model: Image,
            required: true,
          },
        ],
        order: sequelize.literal(`
        (
          6371 * acos(
            cos(radians(${userAddress.lat})) * 
            cos(radians(cast(JSON_EXTRACT(House.location, '$.lat') as decimal))) *
            cos(radians(cast(JSON_EXTRACT(House.location, '$.lon') as decimal)) - radians(${userAddress.lon})) +
            sin(radians(${userAddress.lat})) *
            sin(radians(cast(JSON_EXTRACT(House.location, '$.lat') as decimal)))
          )
        )
      `),
      });

      return res.json(houseList);
    }
  } catch (err) {
    console.error('Error fetching houses:', err);
    return res.status(500).json({
      error: {
        code: 500,
        message: 'An error occurred while fetching houses.',
        details: err.message,
      },
    });
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



module.exports = { postHouse, editHouse, changeHouseStatus,deleteHouse, viewSingleHouse, getAllHouses, getHousesBasedOnRooms, getAllUserBasedHouses }

