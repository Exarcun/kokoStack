const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

const authenticateToken = require('../middlewares/authenticateToken'); // Ensure this line is present



console.log('authRoutes loaded');



router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/profile', authenticateToken, authController.getProfile);



module.exports = router;
