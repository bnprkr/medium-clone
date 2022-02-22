const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils'); 
const { userValidators, loginValidators } = require('./validators')

const router = express.Router();

router.get('/register', csrfProtection, (req, res) => {
  res.render('register', {
    title: 'Register',
    user: {}, 
    csrfToken: req.csrfToken(),
  });
});

router.post('/register', csrfProtection, userValidators,
  asyncHandler(async (req, res) => {
    const {
      username,
      email,
      password,
    } = req.body;

    const user = db.User.build({
      username,
      email,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.hashedPassword = hashedPassword;
      await user.save();
      res.redirect('/');
    } else {
      const errors = validatorErrors.array().map(errorObj => errorObj.msg);
      res.render('register', {
        title: 'Register',
        user, 
        errors, 
        csrfToken: req.csrfToken()
      });
    }

  })
);

router.get('/login', csrfProtection, (req, res) => {
  res.render('login', {
    title: 'Login', 
    csrfToken: req.csrfToken(),
  });
});

router.post('/login', csrfProtection, loginValidators, 
  asyncHandler(async (req, res) => {
    const {
      email, 
      password
    } = req.body;

    let errors = [];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      // TODO login user
    } else {
      errors = validatorErrors.array().map(errorObj => errorObj.msg);
    }

    res.render('login', {
      title: 'Login', 
      email, 
      errors, 
      csrfToken: req.csrfToken(),
    });

  }));

module.exports = router;