const User = require('../models/userModel');
const pool = require('../config/dbConfig'); // Import the MySQL connection pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sequelize = require("sequelize")


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

     // Set the userId property in req.session after successful authentication
     req.session.userId = user.id;

    // Generate a token with the user ID
    const token = jwt.sign({ userId: req.session.userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
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
    const { gender, age, budget, image, personal_id, bio, phone_number, address, job_status, } = req.body;

    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update the user profile data
    user.age = age;
    user.budget = budget;
    user.image = image;
    user.gender = gender;
    user.personal_id = personal_id;
    user.bio = bio;
    user.phone_number = phone_number;
    user.address = address;
    user.job_status = job_status;
    await user.save(); // Save the updated user profile

    res.status(200).json({ message: 'User profile created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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
      age,
      budget,
      image,
      personal_id,
      bio,
      phone_number,
      address,
      job_status
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
