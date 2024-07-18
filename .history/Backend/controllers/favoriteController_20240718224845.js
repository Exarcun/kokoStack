const pool = require('../config/db');



exports.addFavorite = async (req, res) => {

  const { postId } = req.params;

  const userId = req.user.id;



  console.log(`Adding favorite: User ID ${userId}, Post ID ${postId}`);



  if (!userId) {

    console.log('User ID is undefined');

    return res.status(400).json({ message: 'User ID is missing' });

  }



  try {

    // Convert postId to integer

    const postIdInt = parseInt(postId, 10);

    if (isNaN(postIdInt)) {

      return res.status(400).json({ message: 'Invalid post ID' });

    }



    // Check if the favorite already exists

    const checkResult = await pool.query(

      'SELECT favorites FROM users WHERE id = $1',

      [userId]

    );



    if (checkResult.rows.length === 0) {

      return res.status(404).json({ message: 'User not found' });

    }



    const currentFavorites = checkResult.rows[0].favorites || [];



    if (currentFavorites.includes(postIdInt)) {

      return res.status(400).json({ message: 'Post already in favorites' });

    }



    // Add the new favorite

    await pool.query(

      'UPDATE users SET favorites = array_append(favorites, $1) WHERE id = $2',

      [postIdInt, userId]

    );



    res.status(200).json({ message: 'Post added to favorites' });

  } catch (error) {

    console.error('Error adding favorite:', error);

    res.status(500).json({ message: 'Failed to add favorite', error: error.message });

  }

};



exports.removeFavorite = async (req, res) => {

  const { postId } = req.params;

  const userId = req.user.id;



  console.log(`Removing favorite: User ID ${userId}, Post ID ${postId}`);



  if (!userId) {

    console.log('User ID is undefined');

    return res.status(400).json({ message: 'User ID is missing' });

  }



  try {

    // Convert postId to integer

    const postIdInt = parseInt(postId, 10);

    if (isNaN(postIdInt)) {

      return res.status(400).json({ message: 'Invalid post ID' });

    }



    // Remove the favorite

    const result = await pool.query(

      'UPDATE users SET favorites = array_remove(favorites, $1) WHERE id = $2 RETURNING favorites',

      [postIdInt, userId]

    );



    if (result.rows.length === 0) {

      return res.status(404).json({ message: 'User not found' });

    }



    const updatedFavorites = result.rows[0].favorites;

    console.log('Updated favorites:', updatedFavorites);



    res.status(200).json({ message: 'Post removed from favorites', favorites: updatedFavorites });

  } catch (error) {

    console.error('Error removing favorite:', error);

    res.status(500).json({ message: 'Failed to remove favorite', error: error.message });

  }

};



exports.getFavorites = async (req, res) => {

  const userId = req.user.id;

  console.log('Fetching favorites for user ID:', userId);



  if (!userId) {

    console.log('User ID is undefined');

    return res.status(400).json({ message: 'User ID is missing' });

  }



  try {

    const result = await pool.query('SELECT favorites FROM users WHERE id = $1', [userId]);

    console.log('Query result:', result.rows);

    

    if (result.rows.length === 0) {

      console.log('No user found with ID:', userId);

      return res.status(404).json({ message: 'User not found' });

    }

    

    const favorites = result.rows[0].favorites || [];

    console.log('Favorites:', favorites);

    res.status(200).json(favorites);

  } catch (error) {

    console.error('Error getting favorites:', error);

    res.status(500).json({ message: 'Failed to get favorites', error: error.message });

  }

};