// const postHouse = async (req, res) => {
    
// }

// const editHouse = async (req, res) => {
    
// }

// const deleteHouse = async (req, res) => {
    
// }

// const viewSingleHouse = async (req, res) => {
    
// }
// const getAllHouses = async (req, res) => {
    
// }

// module.exports={postHouse,editHouse,deleteHouse,viewSingleHouse,getAllHouses}

const House = require('../models/houseModel');
const pool = require('../config/dbConfig');

// Get All House List
exports.getAllHouse = async (req, res) => {
    try {
    //   const query = 'SELECT * FROM houses'; // Assuming your table name is "houses"
    const query = 'SELECT houses.*, brokers.full_name as broker_name FROM houses JOIN brokers ON houses.broker_id = brokers.id';
  
      const connection = await pool.getConnection(); // Get a connection from the pool
  
      const [brokers] = await connection.query(query); // Execute the query
  
      connection.release(); // Release the connection back to the pool
  
      res.status(200).json(brokers);
    } catch (error) {
      console.error('Error retrieving houses:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

// Create New House
exports.registerHouse = async (req, res) => {
    try {
      const {
        broker_id, location, price, no_of_rooms, description,
      } = req.body;
  
      const houseData = {
        broker_id, location, price, no_of_rooms, description,
      };
  
      const house = new House();
      const houseId = await house.createHouse(houseData);
  
      res.status(201).json({ message: 'House registered successfully', houseId });
    } catch (error) {
      console.error('Error registering house:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

//   Show Specific House
  exports.getHouseById = async (req, res) => {
    try {
      const houseId = req.params.id;
      const house = await House.getHouseById(houseId);
      
      if (!house) {
        return res.status(404).json({ message: 'House not found' });
      }
  
      res.status(200).json(house);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error',error:error.message });
    }
  };

//   Update the House Information
  exports.updateHouse = async (req, res) => {
    try {
      const houseId = req.params.id;
      const updatedHouseData = req.body;
  
      const updatedRowCount = await House.updateHouse(houseId, updatedHouseData);
  
      if (updatedRowCount === 0) {
        return res.status(404).json({ message: 'House not found' });
      }
  
      res.status(200).json({ message: 'House updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


//   Delete the House
  exports.deleteHouse = async (req, res) => {
    try {
      const houseId = req.params.id;
      await House.deleteHouse(houseId);
      res.status(200).json({ message: 'House deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };