const pool = require('../config/db');

const multer = require('multer');

const path = require('path');



// Storage configuration for multer

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, 'uploads/');

  },

  filename: (req, file, cb) => {

    cb(null, Date.now() + path.extname(file.originalname));

  },

});



const upload = multer({ storage: storage });



exports.uploadImage = upload.single('image');



exports.createPost = async (req, res) => {

  console.log('Request file:', req.file);  // Log uploaded file details

  console.log('Request body:', req.body);  // Log request body



  if (!req.file) {

    console.log('No image uploaded');  // Log no file uploaded case

    return res.status(400).send({ message: 'No image uploaded' });

  }



  const { title, category, location, price, description } = req.body;

  const postcreator = req.user.email; // Get the user email from the token



  try {

    const result = await pool.query(

      `INSERT INTO postdata (pic_location, title, categories, cap, price, bio, postcreator) 

       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,

      [req.file.path, title, category, location, price, description, postcreator]

    );



    res.status(201).send({ message: 'Post created successfully', post: result.rows[0] });

  } catch (error) {

    console.error('Database insert error:', error);

    res.status(500).send({ message: 'Internal Server Error' });

  }

};



exports.getUserPosts = async (req, res) => {

  const { email } = req.user;

  console.log(`Fetching posts for user: ${email}`);

  try {

    const result = await pool.query('SELECT * FROM postdata WHERE postcreator = $1', [email]);

    console.log('User posts:', result.rows);

    res.status(200).json(result.rows);

  } catch (error) {

    console.error('Error fetching user posts:', error);

    res.status(500).send({ message: 'Internal Server Error' });

  }

};



exports.getTopCategories = async (req, res) => {

  try {

    console.log('Fetching top categories...');

    const result = await pool.query(`

      SELECT categories as name, COUNT(*) as post_count 

      FROM postdata 

      GROUP BY categories 

      ORDER BY post_count DESC 

      LIMIT 8

    `);

    console.log('Top categories fetched:', result.rows);

    res.status(200).json(result.rows);

  } catch (error) {

    console.error('Error fetching top categories:', error);

    res.status(500).send({ message: 'Internal Server Error' });

  }

};



// New method to fetch all posts without authentication

exports.getAllPosts = async (req, res) => {

  try {

    console.log('Fetching all posts...');

    const result = await pool.query('SELECT * FROM postdata');

    console.log('All posts:', result.rows);

    res.status(200).json(result.rows);

  } catch (error) {

    console.error('Error fetching posts:', error);

    res.status(500).send({ message: 'Internal Server Error' });

  }

};



exports.searchPosts = async (req, res) => {

  const { query } = req.query; // Get the search query from the request



  try {

    console.log(`Searching posts with query: ${query}`);

    const result = await pool.query(

      'SELECT * FROM postdata WHERE title ILIKE $1',

      [`%${query}%`]

    );

    console.log('Search results:', result.rows);

    res.status(200).json(result.rows);

  } catch (error) {

    console.error('Error searching posts:', error);

    res.status(500).send({ message: 'Internal Server Error' });

  }

};



exports.getPostById = async (req, res) => {

  const id = parseInt(req.params.id, 10);

  

  if (isNaN(id)) {

    console.log('Invalid id provided:', req.params.id);

    return res.status(400).json({ message: 'Invalid post ID' });

  }



  try {

    console.log(`Fetching post with id: ${id}`);

    const result = await pool.query('SELECT * FROM postdata WHERE id = $1', [id]);

    

    if (result.rows.length === 0) {

      console.log('Post not found');

      return res.status(404).json({ message: 'Post not found' });

    }

    

    console.log('Post fetched:', result.rows[0]);

    res.status(200).json(result.rows[0]);

  } catch (error) {

    console.error('Error fetching post:', error);

    res.status(500).send({ message: 'Internal Server Error' });

  }

};