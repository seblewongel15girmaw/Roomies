const User = require('../models/userModel');
const pool = require('../config/dbConfig'); // Import the MySQL connection pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
exports.registerUser = async (req, res) => {
  try {
    const {
      full_name, username, email, password, gender, age, budget, image, personal_id, bio, phone_number, address, job_status,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      full_name, username, email,
      password: hashedPassword, gender, age, budget, image, personal_id, bio, phone_number, address, job_status,
    };

    const user = new User();
    const userId = await user.createUser(userData);

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const query = 'SELECT * FROM users'; // Assuming your table name is "users"

    const connection = await pool.getConnection(); // Get a connection from the pool

    const [users] = await connection.query(query); // Execute the query

    connection.release(); // Release the connection back to the pool

    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};














exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { full_name, username,email, password, gender, age, budget, image, personal_id, bio, phone_number, address, job_status } = req.body;

    await User.updateUser(userId, {
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
    });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.deleteUser(userId);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};