const pool = require('../config/db');

const multer = require('multer');

const path = require('path');



// Set up multer for file uploads

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, 'uploads/suggestion/');

  },

  filename: (req, file, cb) => {

    cb(null, Date.now() + path.extname(file.originalname));

  },

});



const upload = multer({ storage: storage });



exports.addSuggestion = [

     upload.single('background_image'),

     async (req, res) => {

       console.log('Received request to add suggestion');

       console.log('Request body:', req.body);

       console.log('Request file:', req.file);

   

       try {

         const { title } = req.body;

         const background_image = req.file.filename;

         const date = new Date().toISOString();

   

         console.log('Inserting suggestion into database');

         console.log('SQL Query:', 'INSERT INTO suggestions (title, background_image, date) VALUES ($1, $2, $3) RETURNING *');

         console.log('Parameters:', [title, background_image, date]);

   

         const result = await pool.query(

           'INSERT INTO suggestions (title, background_image, date) VALUES ($1, $2, $3) RETURNING *',

           [title, background_image, date]

         );

   

         console.log('Suggestion added successfully');

         console.log('Result:', result.rows[0]);

         res.status(201).json(result.rows[0]);

       } catch (err) {

         console.error('Error adding suggestion:', err);

         console.error('Error name:', err.name);

         console.error('Error message:', err.message);

         console.error('Error stack:', err.stack);

         res.status(500).json({ message: 'Error adding suggestion', error: err.message });

       }

     }

   ];



   exports.getSuggestions = async (req, res) => {

     try {

       console.log('Fetching suggestions...');

       const result = await pool.query('SELECT * FROM suggestions ORDER BY date DESC LIMIT 5');

       console.log('Suggestions fetched:', result.rows);

       res.json(result.rows);

     } catch (err) {

       console.error('Error fetching suggestions:', err);

       res.status(500).json({ message: 'Error fetching suggestions', error: err.message });

     }

   };