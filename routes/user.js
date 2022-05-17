const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils'); 
const { userValidators, loginValidators } = require('./validators')
const { loginUser, logoutUser } = require('../auth');

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
      loginUser(req, res, user);
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
      const user = await db.User.findOne({ where: { email }});

      if (user !== null) {
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());

        if (passwordMatch) {
          loginUser(req, res, user);
          return res.redirect('/');
        }
      }

      errors.push('Login failed for the provided email address and password.');
    
    } else {
      errors = validatorErrors.array().map(errorObj => errorObj.msg);
    }

    res.render('login', {
      title: 'Login', 
      email, 
      errors, 
      csrfToken: req.csrfToken(),
    });

  })
);

router.post('/logout', (req, res) => {
  logoutUser(req, res);
  return res.redirect('/login');
});



module.exports = router;