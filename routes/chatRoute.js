const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');
// const { validateChatMessage } = require('../middlewares/chatValidation');

// // router.get('/chats', chatController.getChats);
// router.get('/chats/:senderId/:receiverId', chatController.getChats);

// router.post('/chats', validateChatMessage, chatController.createChat);


// save chat
router.post('/', chatController.saveChatData);

// get single chats
router.get('/:sender_id/:receiver_id', chatController.getSingleUserChat);

// get all chats
router.get('/:sender_id', chatController.getAllUserChat);



module.exports = router;