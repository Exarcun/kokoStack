const express = require('express');

const router = express.Router();

const postController = require('../controllers/postController');

const authenticateToken = require('../middlewares/authenticateToken');



router.post('/posts', authenticateToken, postController.uploadImage, postController.createPost);

router.get('/posts', authenticateToken, postController.getUserPosts);

router.get('/top-categories', postController.getTopCategories); // No authentication needed

router.get('/all-posts', postController.getAllPosts); // No authentication needed for fetching all posts

router.get('/search-posts', postController.searchPosts); // No authentication needed for search

router.get('/posts/:id', (req, res, next) => {

     console.log(`Attempting to fetch post with id: ${req.params.id}`);

     next();

   }, postController.getPostById);





module.exports = router;
