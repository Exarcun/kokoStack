const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
}));

app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Loading routes...');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes'); // New chat routes

app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', categoryRoutes);
app.use('/api', favoriteRoutes);
app.use('/api', suggestionRoutes);
app.use('/api', userRoutes);
app.use('/api', chatRoutes); // Add chat routes

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  socket.on('sendMessage', async (message) => {
    try {
      // Save message to database
      const result = await pool.query(
        'INSERT INTO messages (sender_id, recipient_id, content) VALUES ($1, $2, $3) RETURNING *',
        [message.senderId, message.recipientId, message.content]
      );
      const savedMessage = result.rows[0];

      // Emit message to recipient
      io.to(message.recipientId).emit('newMessage', savedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Successfully connected to the database');
    }
  });
});