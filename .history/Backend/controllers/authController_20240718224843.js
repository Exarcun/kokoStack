const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const pool = require('../config/db');

const secretKey = process.env.SECRET_KEY;



exports.register = async (req, res) => {

  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {

    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);

    res.status(201).send({ message: 'User registered successfully' });

  } catch (error) {

    res.status(500).send({ message: 'Error registering user', error });

  }

};





exports.getProfile = async (req, res) => {

  const { email } = req.user;

  try {

    const user = await pool.query(

      'SELECT email, bio, cap, profilepic, bannerpic, username FROM users WHERE email = $1', 

      [email]

    );

    if (user.rows.length > 0) {

      res.json({

        email: user.rows[0].email,

        bio: user.rows[0].bio,

        cap: user.rows[0].cap,

        profilepic: user.rows[0].profilepic,

        bannerpic: user.rows[0].bannerpic,

        username: user.rows[0].username

      });

    } else {

      res.status(404).send({ message: 'User not found' });

    }

  } catch (error) {

    res.status(500).send({ message: 'Error fetching user profile', error });

  }

};







exports.login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length > 0) {

      const validPassword = await bcrypt.compare(password, user.rows[0].password);

      if (validPassword) {

        const token = jwt.sign(

          { id: user.rows[0].id, email: user.rows[0].email },

          secretKey,

          { expiresIn: '1h' }

        );

        res.json({ token });

      } else {

        res.status(401).send({ message: 'Invalid password' });

      }

    } else {

      res.status(404).send({ message: 'User not found' });

    }

  } catch (error) {

    res.status(500).send({ message: 'Error logging in', error });

  }

};
