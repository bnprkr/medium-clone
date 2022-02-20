const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils'); 

const router = express.Router();

router.get('/register', csrfProtection, (req, res) => {
  // const user = db.User.build();
  res.render('register', {
    title: 'Register',
    // user, 
    csrfToken: req.csrfToken(),
  });

  const userValidators = [
    // TODO define validators
  ];
});

router.post('/register', csrfProtection, (req, res) => {
  asyncHandler(async (req, res) => {
    const {
      username,
      emailAddress,
      password,
    } = req.body;

    const user = db.User.build({
      username,
      email,
    });

    const validatorErrors = validationResult(req);

    
  })
});

router.get('/login', (req, res) => {
  res.send('OK');
});

module.exports = router;