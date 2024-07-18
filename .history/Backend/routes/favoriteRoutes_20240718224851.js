const express = require('express');

const router = express.Router();

const favoriteController = require('../controllers/favoriteController');

const authenticateToken = require('../middlewares/authenticateToken');



// Add a post to favorites

router.post('/favorites/:postId', authenticateToken, favoriteController.addFavorite);



// Remove a post from favorites

router.delete('/favorites/:postId', authenticateToken, favoriteController.removeFavorite);



// Get all favorites for a user

router.get('/favorites', authenticateToken, favoriteController.getFavorites);



module.exports = router;