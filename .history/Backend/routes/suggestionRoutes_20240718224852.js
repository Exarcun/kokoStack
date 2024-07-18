const express = require('express');

const router = express.Router();

const suggestionController = require('../controllers/suggestionController');



router.get('/suggestions', suggestionController.getSuggestions);

router.post('/suggestions', suggestionController.addSuggestion);



module.exports = router;