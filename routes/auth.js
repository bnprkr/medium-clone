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
});

const userValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 255 })
    .withMessage('Email Address cannot be longer than 255 characters')
    .isEmail()
    .withMessage('Email Address is not a valid email')
    .custom(value => {
      return db.User.findOne({ where: { email: value } })
        .then(user => {
          if (user) {
            return Promise.reject('Email already in use.');
          }
        });
    }),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a Username')
    .isLength({ max: 50 })
    .withMessage('Username cannot not be more than 50 characters long')
    .custom(value => {
      return db.User.findOne({ where: { username: value } })
        .then(user => {
          if (user) {
            return Promise.reject('Username already in use.');
          }
        });
    }),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ max: 50 })
    .withMessage('Password must not be more than 50 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Confirm Password')
    .isLength({ max: 50 })
    .withMessage('Confirm Password must not be more than 50 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm Password does not match Password');
      }
      return true;
    }),
];

router.post('/register', csrfProtection, userValidators, (req, res) => {
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
});

router.get('/login', (req, res) => {
  res.send('OK');
});

module.exports = router;