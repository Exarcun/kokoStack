const pool = require('../config/db');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.getUserProfile = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query('SELECT email, bio, cap, profilepic, bannerpic, username FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query('SELECT id, title, categories, price, pic_location FROM postdata WHERE postcreator = $1', [email]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Error fetching user posts', error: error.message });
  }
};

exports.updateProfilePic = [
  upload.single('profilepic'),
  async (req, res) => {
    const { email } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
      const result = await pool.query('UPDATE users SET profilepic = $1 WHERE email = $2 RETURNING profilepic', [req.file.path, email]);
      res.json({ profilepic: result.rows[0].profilepic });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ message: 'Error updating profile picture', error: error.message });
    }
  }
];

exports.updateBannerPic = [
  upload.single('bannerpic'),
  async (req, res) => {
    const { email } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
      const result = await pool.query('UPDATE users SET bannerpic = $1 WHERE email = $2 RETURNING bannerpic', [req.file.path, email]);
      res.json({ bannerpic: result.rows[0].bannerpic });
    } catch (error) {
      console.error('Error updating banner picture:', error);
      res.status(500).json({ message: 'Error updating banner picture', error: error.message });
    }
  }
];

exports.updateUsername = async (req, res) => {
  const { email } = req.params;
  const { username } = req.body;
  try {
    const result = await pool.query('UPDATE users SET username = $1 WHERE email = $2 RETURNING username', [username, email]);
    res.json({ username: result.rows[0].username });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ message: 'Error updating username', error: error.message });
  }
};

exports.updateBio = async (req, res) => {
  const { email } = req.params;
  const { bio } = req.body;
  try {
    const result = await pool.query('UPDATE users SET bio = $1 WHERE email = $2 RETURNING bio', [bio, email]);
    res.json({ bio: result.rows[0].bio });
  } catch (error) {
    console.error('Error updating bio:', error);
    res.status(500).json({ message: 'Error updating bio', error: error.message });
  }
};

exports.updateCap = async (req, res) => {
  const { email } = req.params;
  const { cap } = req.body;
  try {
    const result = await pool.query('UPDATE users SET cap = $1 WHERE email = $2 RETURNING cap', [cap, email]);
    res.json({ cap: result.rows[0].cap });
  } catch (error) {
    console.error('Error updating cap:', error);
    res.status(500).json({ message: 'Error updating cap', error: error.message });
  }
};
