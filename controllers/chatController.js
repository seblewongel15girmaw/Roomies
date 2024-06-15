
const mysql = require("mysql2")
const Chat = require("../models/chatModel")
const { Op } = require("sequelize");
const User = require('../models/userModel');
require("dotenv").config()

const admin = require("firebase-admin");


// save the chat message
async function saveChatData(req, res) {
    const { sender_id, receiver_id, message } = req.body;
    const status = 'delivered'; // Set default status as 'delivered'
    // find receiver
    let receiver = await User.findOne({ where: { receiver_id } });
  
    try {
      // Save the chat data to the database
      const chat = await Chat.create({
        sender_id,
        receiver_id,
        message,
        status
      });


  // Find sender and receiver names for notification
  let sender = await User.findByPk(sender_id);
  let receiver = await User.findByPk(receiver_id);
  
  if (!sender || !receiver) {
    return res.status(404).json({ error: 'Sender or Receiver not found' });
  }
  // Send push notification to the receiver if chat saved successfully
  await sendPushNotification(receiver.fcm_token, {
    title: `${sender.name}`, // Update title with sender's name
    body: message // Use the chat message as the body
  });


  
      return res.status(201).json({ message: 'chat saved  successfully' });
    } catch (error) {
      
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ errors });
      }

      console.error(error);
      return res.status(500).json({ error: 'Internal server error' , error: error.message});
    }
}

// notification
const sendPushNotification = async (fcmToken, message) => {
  try {
    let notificationMessage = {
      notification: {
        title: message.title,
        body: message.body
      },
      
      token: fcmToken
    };

    await admin.messaging().send(notificationMessage);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

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
    console.log(typeof(sender_id));
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
        if (chat.sender_id == sender_id && !ids.includes(chat.receiver_id)) {
          ids.push(chat.receiver_id);
        } else if (chat.receiver_id == sender_id && !ids.includes(chat.sender_id)) {
          ids.push(chat.sender_id);
        }
        return ids;
      }, []);

      console.log("userId are ", userIds)
  
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
              user_name:user.user_name,
              username: user.username,
              image: user.image,
              address:user.address,
              createdAt:user.createdAt
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