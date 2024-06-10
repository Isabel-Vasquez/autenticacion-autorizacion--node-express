const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { email, password, rol, lenguage } = req.body;
  if (!email || !password || !rol || !lenguage) {
    return res.status(400).send('All fields are required');
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    await pool.query(
      'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)',
      [email, hashedPassword, rol, lenguage]
    );
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).send('User not found');
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send('Error logging in');
  }
};

const getUser = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [
      req.user.email,
    ]);
    const user = result.rows[0];
    res.status(200).send([user]);
  } catch (err) {
    res.status(500).send('Error retrieving user data');
  }
};

module.exports = { registerUser, loginUser, getUser };
