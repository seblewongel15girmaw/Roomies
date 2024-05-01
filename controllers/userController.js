const User = require('../models/userModel');
// const pool = require('../config/dbConfig'); // Import the MySQL connection pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize } = require("sequelize")
const path = require('path');
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
      password: hashedPassword
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

    // Generate a token with the user ID
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    // console.log(token);

    res.status(200).json({ message: 'User logged in successfully', token });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// Create User Profile
exports.createUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a route parameter
    const { gender,religion, age, budget, image, personal_id, bio, phone_number, address, job_status,smoking,pets,privacy,religious_compatibility,socialize} = req.body;
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send("Files are missing");
    }
    const imagePath1 = path.join(imagesDirectory, files["image"][0].filename);
    const imagePath2=path.join(imagesDirectory,files["personal_id"][0].filename)
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
    user.address =address;
    user.job_status = job_status;
    user.smoking = smoking;
    user.pets = pets;
    user.privacy = privacy;
    user.religious_compatibility = religious_compatibility;
    user.socialize=socialize;
    await user.save(); // Save the updated user profile

    // Retrieve other users' data (example: fetching from a database)
    const otherUsers = await User.findAll();
    // Create an array to hold user data and other users' data
    const userData = [];
    // Add the user's data to the array
    userData.push({
      user: {
        id: user.id,
        age: user.age,
        budget: user.budget,
        gender: user.gender,
        religion: user.religion,
        bio: user.bio,
        address: user.address,
        job_status: user.job_status,
        smoking: user.smoking,
        pets: user.pets,
        privacy: user.privacy,
        religious_compatibility: user.religious_compatibility,
        socialize: user.socialize,
    
      }
    });

    // Add other users' data to the array
    for (const otherUser of otherUsers) {
      userData.push({
        other: {
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
        }
      });
    }

    // Send the user data and other users' data in the response
    res.status(200).json({
      message: 'User profile created successfully',
      userData: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' ,error: error.message });
  }
};

// save similarity
exports.saveSimilarity =async(req, res) =>{

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


// Update User Profile
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { full_name, username, email, password, gender, age, budget, image, personal_id, bio, phone_number, address, job_status } = req.body;

    await User.update({
      full_name,
      username,
      email,
      password,
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
      chores,
      smoking,
      
    
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
