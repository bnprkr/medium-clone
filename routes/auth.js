// authentication related routes 
// /signup
// /login

const express = require('express');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send('OK');
});

router.get('/login', (req, res) => {
  res.send('OK');
});

module.exports = router;