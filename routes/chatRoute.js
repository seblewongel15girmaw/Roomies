const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');
// const { validateChatMessage } = require('../middlewares/chatValidation');

// // router.get('/chats', chatController.getChats);
// router.get('/chats/:senderId/:receiverId', chatController.getChats);

// router.post('/chats', validateChatMessage, chatController.createChat);

router.post('/chat', chatController.saveChatData);

module.exports = router;