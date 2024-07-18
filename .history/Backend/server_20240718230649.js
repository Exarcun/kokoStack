const express = require('express');

const cors = require('cors');

const dotenv = require('dotenv');

const { Pool } = require('pg');

const fs = require('fs');

const path = require('path');





dotenv.config();



const app = express();

const port = process.env.PORT || 5000;



app.use(cors({

  origin: '*',

}));



app.use(express.json());



const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {

  fs.mkdirSync(uploadDir);

}



// Serve static files from the 'uploads' directory

app.use('/uploads', express.static(uploadDir));



// Database connection

const pool = new Pool({

  user: process.env.DB_USER,

  host: process.env.DB_HOST,

  database: process.env.DB_NAME,

  password: process.env.DB_PASSWORD,

  port: process.env.DB_PORT,

});



// Import routes

console.log('Loading routes...');

const authRoutes = require('./routes/authRoutes');

const postRoutes = require('./routes/postRoutes');

const categoryRoutes = require('./routes/categoryRoutes');

const favoriteRoutes = require('./routes/favoriteRoutes');

const suggestionRoutes = require('./routes/suggestionRoutes');

const userRoutes = require('./routes/userRoutes');



app.use('/api', authRoutes);

app.use('/api', postRoutes);

app.use('/api', categoryRoutes);

app.use('/api', favoriteRoutes);

app.use('/api', suggestionRoutes);

app.use('/api', userRoutes);



app.use((req, res, next) => {

  console.log(`Received ${req.method} request for ${req.url}`);

  next();

});



app.listen(port, () => {

  console.log(`Server running on port ${port}`);

  

  // Test database connection and suggestions table

  pool.query('SELECT * FROM suggestions LIMIT 1', (err, res) => {

    if (err) {

      console.error('Error querying suggestions table:', err);

    } else {

      console.log('Successfully queried suggestions table');

      console.log('Result:', res.rows);

    }

  });

});


