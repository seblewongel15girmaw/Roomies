const Broker = require('../models/brokerModel');
const pool = require('../config/dbConfig'); // Import the MySQL connection pool
const bcrypt = require('bcrypt');

exports.getAllBrokers = async (req, res) => {
  try {
    const query = 'SELECT * FROM brokers'; // Assuming your table name is "users"

    const connection = await pool.getConnection(); // Get a connection from the pool

    const [brokers] = await connection.query(query); // Execute the query

    connection.release(); // Release the connection back to the pool

    res.status(200).json(brokers);
  } catch (error) {
    console.error('Error retrieving brokers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



exports.registerBroker = async (req, res) => {
  try {
    const {
      full_name, username, email, password, gender, address, phone_number1, profile_pic, phone_number2,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const brokerData = {
      full_name,
      username,
      email,
      gender,
      address,
      phone_number1,
      profile_pic: profile_pic || null, // Set to null if it's undefined
      phone_number2,
      password: hashedPassword,
    };

    const broker = new Broker();
    const brokerID = await broker.createBroker(brokerData);

    res.status(201).json({ message: 'Broker registered successfully', brokerID });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



exports.updateBroker = async (req, res) => {
  try {
    const bokerID = req.params.id;
    const { full_name, username, email, password, gender, address, phone_number1, profile_pic, phone_number2, } = req.body;

    await Broker.updateBroker(bokerID, {
        full_name, username, email, password, gender, address, phone_number1, profile_pic, phone_number2,
    });

    res.status(200).json({ message: 'Broker updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteBroker = async (req, res) => {
  try {
    const brokerId = req.params.id;
    await Broker.deleteBroker(brokerId);

    res.status(200).json({ message: 'Broker deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



