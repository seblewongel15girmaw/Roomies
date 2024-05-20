const pool = require('../config/dbConfig');

const User = require("../models/userModel")

// Create a new feedback
// async function createFeedback(req, res) {
//   try {
//     const { user_id, date, rating, feedback_message, feedback_category } = req.body;

//     // Insert the feedback into the database
//     const query = `
//       INSERT INTO feedbacks (user_id, date, rating, feedback_message, feedback_category)
//       VALUES (?, ?, ?, ?, ?)
//     `;
//     await db.query(query, [user_id, date, rating, feedback_message, feedback_category]);

//     res.status(201).json({ success: true, message: 'Feedback created successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// }
const Feedback = require('../models/feedbackModel');

// Create a new feedback
async function createFeedback(req, res) {
  try {
    const { user_id } = req.params;
    const { rating, feedback_message, feedback_category } = req.body;

    // Create a new Feedback instance
    const feedback = await Feedback.create({
      user_id,
      rating,
      feedback_message,
      feedback_category
    });

    res.status(201).json({ success: true, message: 'Feedback created successfully', data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// get all feedbacks
async function getAllFeedbacks(req, res) {
  try {
    const feedbacks = await Feedback.findAll({
      include: User, // Include the User model in the query
    });

    // Map the feedback data to include the username
    const feedbacksWithUsername = feedbacks.map(feedback => ({
      id: feedback.id,
      username: feedback.User ? feedback.User.username : 'Unknown',
      rating: feedback.rating,
      feedback_message: feedback.feedback_message,
      feedback_category: feedback.feedback_category,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));

    res.status(200).json(feedbacksWithUsername);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}




module.exports = { createFeedback,getAllFeedbacks  };