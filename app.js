const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const store = require('connect-pg-simple');

const { secret } = require('./config').session;
const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'pug');
app.use(cookieParser(secret));
app.use(session({
  // note secure cookie needed in production with expiry time...
  store: new (store(session))(),
  secret,
  resave: false,
  saveUninitialized: false
}));
app.use(morgan('dev'));
app.use(authRoutes);

module.exports = app;