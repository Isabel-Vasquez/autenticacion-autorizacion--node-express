const express = require('express');
const {
  registerUser,
  loginUser,
  getUser,
} = require('../controllers/usersController');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/usuarios', registerUser);
router.post('/login', loginUser);
router.get('/usuarios', verifyToken, getUser);

module.exports = router;
