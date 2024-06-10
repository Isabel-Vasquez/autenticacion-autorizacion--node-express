require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', usersRouter);

module.exports = app;
