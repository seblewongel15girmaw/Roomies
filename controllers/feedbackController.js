const pool = require('../config/dbConfig');



// Create a new feedback
async function createFeedback(req, res) {
  try {
    const { user_id, date, rating, feedback_message, feedback_category } = req.body;

    // Insert the feedback into the database
    const query = `
      INSERT INTO feedbacks (user_id, date, rating, feedback_message, feedback_category)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [user_id, date, rating, feedback_message, feedback_category]);

    res.status(201).json({ success: true, message: 'Feedback created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// get all feedback
async function getAllFeedbacks(req, res) {
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();
  
      // Execute the query
      const [rows] = await connection.query('SELECT * FROM feedbacks');
  
      // Release the connection back to the pool
      connection.release();
  
      res.json({ success: true, data: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
  


module.exports = { createFeedback,getAllFeedbacks  };