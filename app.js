const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const store = require('connect-pg-simple');
const cookieParser = require('cookie-parser');

const { secret } = require('./config').session;
const authRoutes = require('./routes/user');
const userRoutes = require('./routes/me');
const storyRoutes = require('./routes/story');
const apiRoutes = require('./routes/api');
const { restoreUser } = require('./auth');

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
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(restoreUser);
app.use(authRoutes);
app.use(userRoutes);
app.use(storyRoutes);
app.use('/api', apiRoutes);

module.exports = app;