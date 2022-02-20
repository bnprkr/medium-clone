const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils'); 

const router = express.Router();

router.get('/register', csrfProtection, (req, res) => {

  res.render('register', {
    title: 'Register',
    user: {}, 
    csrfToken: req.csrfToken(),
  });

  const userValidators = [
    check('email')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Email Address')
      .isLength({ max: 255 })
      .withMessage('Email Address length cannot be longer than 255 characters')
      .isEmail()
      .withMessage('Email Address is not a valid email')
      .custom(value => {
        return db.User.findOne({ where: { email: value } })
          .then(user => {
            if (user) {
              return Promise.reject('Email already in use.');
            }
          });
      })
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

    if (validatorErrors.isEmpty()) {
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
});

router.get('/login', (req, res) => {
  res.send('OK');
});

module.exports = router;