const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middlewares/authenticateToken');

// Ensure that all these methods exist in your chatController
router.get('/conversations', authenticateToken, chatController.getConversations);
router.post('/conversations', authenticateToken, chatController.createConversation);
router.get('/conversations/:conversationId/messages', authenticateToken, chatController.getMessages);
router.post('/messages', authenticateToken, chatController.sendMessage);

module.exports = router;