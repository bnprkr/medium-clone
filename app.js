const express = require('express');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(authRoutes);

module.exports = app;