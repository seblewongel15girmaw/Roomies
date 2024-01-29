const Chat = require('../models/chatModel');

class ChatController {
  static async createChat(req, res) {
    try {
      const { sender_id, receiver_id, message,image } = req.body;
      

      const chatId = await Chat.createChat(sender_id, receiver_id, message, image);

      res.status(201).json({ chatId });
    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(500).json({ error: 'Failed to create chat', error: error.message });
    }
  }

  static async getChats(req, res) {
    try {
      const { senderId, receiverId } = req.params; // Use req.params to get parameters from the URL
  
      const chats = await Chat.getChats(senderId, receiverId);
  
      res.status(200).json({ chats });
    } catch (error) {
      console.error('Error retrieving chats:', error);
      res.status(500).json({ error: 'Failed to retrieve chats', errorMessage: error.message });
    }
  
  }

  // ...
}

module.exports = ChatController;