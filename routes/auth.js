const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils'); 
const { userValidators } = require('./validators')

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

router.get('/login', (req, res) => {
  res.send('OK');
});

module.exports = router;