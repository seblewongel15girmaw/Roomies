
const mysql = require("mysql2")
const Chat = require("../models/chatModel")
const { Op } = require("sequelize");
const User = require('../models/userModel');

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

// Retrieve the chat messages between a single user and a specific sender
async function getSingleUserChat(req, res) {
    const { sender_id, receiver_id } = req.params;
  
    try {
      // Retrieve the chat messages
      const messages = await Chat.findAll({
        where: {
          [Op.or]: [
            {
              sender_id,
              receiver_id,
            },
            {
              sender_id: receiver_id,
              receiver_id: sender_id,
            },
          ],
        },
      });
  
      return res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error", error: error.message });
    }
  }

//   get all chats
async function getAllUserChat(req, res) {
    const { sender_id } = req.params;
  
    try {
      const chats = await Chat.findAll({
        where: {
          [Op.or]: [
            { sender_id },
            { receiver_id: sender_id },
          ]
        },
        order: [["createdAt", "DESC"]],
      });
  
      const userIds = chats.reduce((ids, chat) => {
        if (chat.sender_id === sender_id && !ids.includes(chat.receiver_id)) {
          ids.push(chat.receiver_id);
        } else if (chat.receiver_id === sender_id && !ids.includes(chat.sender_id)) {
          ids.push(chat.sender_id);
        }
        return ids;
      }, []);
  
      const users = await User.findAll({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
      });
  
      const usersWithLatestMessage = await Promise.all(
        users.map(async (user) => {
          const latestMessage = await Chat.findOne({
            where: {
              [Op.or]: [
                { sender_id, receiver_id: user.id },
                { sender_id: user.id, receiver_id: sender_id },
              ],
            },
            order: [["createdAt", "DESC"]],
          });
  
          return {
            id: user.id,
            profile: {
              id: user.id,
              full_name: user.full_name,
              image: user.image,
            },
            last_message: latestMessage ? latestMessage.message : null,
          };
        })
      );
  
      return res.status(200).json(usersWithLatestMessage);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error", error: error.message });
    }
  }
  
  

  
  module.exports = {
    saveChatData,
    getSingleUserChat,
    getAllUserChat
  };