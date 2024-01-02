
const pool = require('../config/dbConfig'); // Import the MySQL connection pool
const Guarantor = require('../models/guarantorModel');

exports.getAllGuarantor = async (req, res) => {
  try {
    const query = 'SELECT * FROM guarantors'; // Assuming your table name is "users"

    const connection = await pool.getConnection(); // Get a connection from the pool

    const [brokers] = await connection.query(query); // Execute the query

    connection.release(); // Release the connection back to the pool

    res.status(200).json(brokers);
  } catch (error) {
    console.error('Error retrieving guarantors:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// function that registor guarantors
exports.registerGuarantor = async (req, res) => {
    try {
      const {
        full_name, user_id, personal_id_image, address, phone_number, gender,
      } = req.body;

  
      const guarantorData = {
        full_name, user_id, personal_id_image:personal_id_image || null, address, phone_number, gender
      };
  
      const guarantor = new Guarantor();
      const guarantorID = await guarantor.createGuarantor(guarantorData);
  
      res.status(201).json({ message: 'Guarantor registered successfully', guarantorID });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


  exports.updateGuarantor = async (req, res) => {
    try {
      const guarantorId = req.params.id;
      const { full_name, user_id, personal_id_image, address, phone_number, gender,} = req.body;
  
      await User.updateGuarantor(guarantorId, {
        full_name, user_id, personal_id_image:personal_id_image || null, address, phone_number, gender,
      });
  
      res.status(200).json({ message: ' Guarantor updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.deleteGuarantor = async (req, res) => {
    try {
      const guarantorId = req.params.id;
      await Guarantor.deleteGuarantor(guarantorId);
  
      res.status(200).json({ message: 'Guarantor deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

