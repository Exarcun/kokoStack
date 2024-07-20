const pool = require('../config/db');

exports.getConversations = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT c.*, 
        CASE 
          WHEN c.user1_id = $1 THEN u2.email 
          ELSE u1.email 
        END AS other_user_email,
        m.content AS last_message,
        m.created_at AS last_message_time
      FROM conversations c
      JOIN users u1 ON c.user1_id = u1.id
      JOIN users u2 ON c.user2_id = u2.id
      LEFT JOIN messages m ON c.id = m.conversation_id
      WHERE (c.user1_id = $1 OR c.user2_id = $1)
        AND m.id = (
          SELECT id FROM messages 
          WHERE conversation_id = c.id 
          ORDER BY created_at DESC 
          LIMIT 1
        )
      ORDER BY m.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

exports.createConversation = async (req, res) => {
  const { otherUserEmail } = req.body;
  const userId = req.user.id;
  try {
    // First, check if a conversation already exists
    const existingConversation = await pool.query(
      `SELECT id FROM conversations 
       WHERE (user1_id = $1 AND user2_id = (SELECT id FROM users WHERE email = $2))
       OR (user2_id = $1 AND user1_id = (SELECT id FROM users WHERE email = $2))`,
      [userId, otherUserEmail]
    );

    if (existingConversation.rows.length > 0) {
      return res.json({ id: existingConversation.rows[0].id });
    }

    // If no existing conversation, create a new one
    const result = await pool.query(
      `INSERT INTO conversations (user1_id, user2_id) 
       VALUES ($1, (SELECT id FROM users WHERE email = $2)) 
       RETURNING id`,
      [userId, otherUserEmail]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Error creating conversation', error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [conversationId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { conversationId, content } = req.body;
  const senderId = req.user.id;
  try {
    const result = await pool.query(
      'INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
      [conversationId, senderId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};