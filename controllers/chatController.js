
const mysql = require("mysql2")
const Chat = require("../models/chatModel")


require("dotenv").config()


// save the chat message
async function saveChatData(req, res) {
    const { sender_id, receiver_id, message } = req.body;
    const status = 'delivered'; // Set default status as 'delivered'
  
    try {
      // Save the chat data to the database
      const chat = await Chat.create({
        sender_id,
        receiver_id,
        message,
        status
      });
  
      return res.status(201).json({ message: 'chat saved  successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' , error: error.message});
    }
  }
  
  module.exports = {
    saveChatData
  };