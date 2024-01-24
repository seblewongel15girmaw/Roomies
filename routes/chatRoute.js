const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateChatMessage } = require('../middlewares/chatValidation');

router.get('/chats', chatController.getChats);

router.post('/chats', validateChatMessage, chatController.createChat);

module.exports = router;