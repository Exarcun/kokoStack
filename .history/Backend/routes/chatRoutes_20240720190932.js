const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/conversations', authenticateToken, chatController.getConversations);
router.get('/conversations/:conversationId/messages', authenticateToken, chatController.getMessages);
router.post('/conversations', authenticateToken, chatController.createConversation);
router.post('/messages', authenticateToken, chatController.sendMessage);

module.exports = router;
