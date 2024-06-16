const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middlewares/auth');

// save chat
// router.post('/', chatController.saveChatData);
router.post('/', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        chatController.saveChatData(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });

// get single chats
// router.get('/:sender_id/:receiver_id', chatController.getSingleUserChat);
router.get('/:sender_id/:receiver_id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        chatController.getSingleUserChat(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });


// get all chats
// router.get('/:sender_id', chatController.getAllUserChat);
router.get('/:sender_id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        chatController.getAllUserChat(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });


module.exports = router;