const User = require('../models/userModel');
const Similarity = require('../models/similarityModel');
// const pool = require('../config/dbConfig'); // Import the MySQL connection pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, where } = require("sequelize")
const path = require('path');
const axios = require('axios')
const imagesDirectory = path.join(__dirname, "..", 'images');

// register User
exports.registerUser = async (req, res) => {
  try {
    const { full_name, username, email, password } = req.body;


    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      res.status(400).json({ message: 'Username or email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      full_name,
      username,
      email,
      password: hashedPassword,
      profile_status: 0

    };

    const user = await User.create(userData);

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Retrieve the user from the database
    const user = await User.getUserByUsername(username);

    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    // Generate a token with the user ID and role =user
    // const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const token = jwt.sign({ userId: user.id, role: 'user' }, process.env.SECRET_KEY, { expiresIn: '1h' });



    res.status(200).json({ message: 'User logged in successfully', token });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// Create User Profile
exports.createUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { gender, religion, age, budget, image, personal_id, bio, phone_number, address, job_status, smoking, pets, privacy, religious_compatibility, socialize } = req.body;
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send("Files are missing");
    }
    const imagePath1 = path.join(imagesDirectory, files["image"][0].filename);
    const imagePath2 = path.join(imagesDirectory, files["personal_id"][0].filename)
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update the user profile data
    user.age = age;
    user.budget = budget;
    user.image = imagePath1;
    user.gender = gender;
    user.religion = religion;
    user.personal_id = imagePath2;
    user.bio = bio;
    user.phone_number = phone_number;
    user.address = address;
    user.job_status = job_status;
    user.smoking = smoking;
    user.pets = pets;
    user.privacy = privacy;
    user.religious_compatibility = religious_compatibility;
    user.socialize = socialize;
    user.profile_status = 1;
    user.activate_status = 1;
    await user.save(); // Save the updated user profile

    // Retrieve other users' data 
    const otherUsers = await User.findAll();
    // Create an array to hold user data and other users' data
    const userData = [];

    // Add other users' data to the array
    for (const otherUser of otherUsers) {

      // Check if the user has a full profile and activate status is on
      if (

        otherUser.profile_status == 1 &&
        otherUser.activate_status == 1) {
        userData.push({
          user: {
            id: otherUser.id,
            age: otherUser.age,
            budget: otherUser.budget,
            gender: otherUser.gender,
            religion: otherUser.religion,
            bio: otherUser.bio,
            address: otherUser.address,
            job_status: otherUser.job_status,
            smoking: otherUser.smoking,
            pets: otherUser.pets,
            privacy: otherUser.privacy,
            religious_compatibility: otherUser.religious_compatibility,
            socialize: otherUser.socialize,
            profile_status: otherUser.profile_status,
            activate_status: otherUser.activate_status,
          }
        });
      }

    }

    // console.log(userData)

    // 
    axios.post('http://127.0.0.1:5000/calculate', userData).then(async (response) => {
      const similarityScores = response.data['matches']
      try {
        for (const score of similarityScores) {
          const { userId, similarityScores } = score;

          // Check if the user already exists in the similarity table
          let existingUser = await Similarity.findOne({ where: { userId } });

          if (existingUser) {
            // User already exists, update the similarity scores
            existingUser.similarityScores = similarityScores;
            await existingUser.save();
          } else {
            // User does not exist, create a new record
            await Similarity.create({ userId, similarityScores });
          }
        }


      } catch (error) {
        console.error('Error saving similarity scores:', error);

      }
    }).catch(error => {
      console.log(error)
    })

    // Send the user data and other users' data in the response
    res.status(200).json({
      message: 'User profile created successfully',
      userData: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};




exports.recommendedStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    // Fetch the user's current password and activate_status
    const user = await User.findByPk(userId, {
      attributes: ['password', 'activate_status'],
    });

    // Compare the sent password with the user's password
    if (await bcrypt.compare(password, user.password)) {
      // Update the activate status based on the current status
      const newStatus = user.activate_status === 1 ? 0 : 1;

      // Update the user's activate status
      await User.update({ activate_status: newStatus }, {
        where: { id: userId },
      });

      res.status(200).json({
        success: true,
        message: `Activate status updated to ${newStatus}`,
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating activate status',
      error: error.message,
    });
  }
};

// get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// get single user
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findOne({
      where: {
        id: userId
      }
    }
    )
    res.status(200).json({ user: user })
  }
  catch (error) {
    console.log(error)
    res.status(500).json()
  }
}


// Update User Profile
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { full_name, username, gender, religion, age, budget, image, personal_id, bio, phone_number, address, job_status, smoking, pets, privacy, religious_compatibility, socialize } = req.body;


    await User.update({
      full_name,
      username,
      gender,
      religion,
      age,
      budget,
      image,
      personal_id,
      bio,
      phone_number,
      address,
      job_status,
      smoking,
      pets,
      privacy,
      religious_compatibility,
      socialize
    }, {
      where: {
        id: userId
      }
    });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete The created account
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.destroy({
      where: {
        id: userId
      }
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// update payment status
exports.changePaymentStatus = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    await User.update({
      payment_status: 1
    },
      {
        where: {
          id: userId
        }
      })

    res.json("payment status updated");
  }
  catch (err) {
    res.json("error has occured while updating payment status")
  }
}

exports.getUserStatus = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await User.findOne({
      attributes: ['profile_status', 'payment_status'],
      where: { id: userId }
    });
    res.json(user);
  }
  catch (err) {
    res.status(500).json(err);
  }
}
