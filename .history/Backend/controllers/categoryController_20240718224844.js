const pool = require('../config/db');



exports.getCategories = async (req, res) => {

  try {

    const result = await pool.query('SELECT * FROM categories');

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).send('Server Error');

  }

};
