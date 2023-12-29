const User = require('../models/userModel');
const pool = require('../config/dbConfig'); // Import the MySQL connection pool
const bcrypt = require('bcrypt');

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



exports.registerUser = async (req, res) => {
    try {
      const {
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
        job_status,
      } = req.body;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const userData = {
        full_name,
        username,
        email,
        password: hashedPassword,
        gender,
        age,
        budget,
        image,
        personal_id,
        bio,
        phone_number,
        address,
        job_status,
      };
  
      const user = new User();
      const userId = await user.createUser(userData);
  
      res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        
        console.error('Error register users:', error);
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