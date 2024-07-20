const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/user/:email', userController.getUserProfile);
router.get('/user/:email/posts', userController.getUserPosts);
router.put('/user/:email/profilepic', authenticateToken, userController.updateProfilePic);
router.put('/user/:email/bannerpic', authenticateToken, userController.updateBannerPic);
router.put('/user/:email/username', authenticateToken, userController.updateUsername);
router.put('/user/:email/bio', authenticateToken, userController.updateBio);
router.put('/user/:email/cap', authenticateToken, userController.updateCap);

module.exports = router;