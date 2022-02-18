const express = require('express');
const morgan = require('morgan');
const session = require('express-session');

const { secret } = require('./config').session;
const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'pug');
app.use(session({
  secret,
  resave: false,
  saveUninitialised: false
}));
app.use(morgan('dev'));
app.use(authRoutes);

module.exports = app;