const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils'); 
const { userValidators, loginValidators } = require('./validators')
const { loginUser, logoutUser } = require('../auth');
const { render } = require('../app');

const router = express.Router();

// helper function for login route
function renderLogin(res, req, email, errors) {
  res.render('login', {
    title: 'Login', 
    email, 
    errors, 
    csrfToken: req.csrfToken(),
  });
}

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
          req.session.save((err) => {
            if (err) return next(err);
            return res.redirect('/');
          });
        } else {
          errors.push('Login failed for the provided email address and password.');
          renderLogin(res, req, email, errors);
        }
      } else {
        errors.push('Login failed for the provided email address and password.');
        renderLogin(res, req, email, errors);
      }
    
    } else {
      errors = validatorErrors.array().map(errorObj => errorObj.msg);
      renderLogin(res, req, email, errors);
    }
  })
);

router.get('/demo-login', csrfProtection, loginValidators, 
  asyncHandler(async (req, res) => {
    console.log('you are in the POST demo-login route...');


    // possibilities: 
    // 1. demo login not requested yet
    // 2. demo login requested but not created/logged in (possibly failed)
    // 3. demo login already requested and created and logged in

    // demo login not requested yet (undefined) or failed (false)
    // if (!res.locals.demo) {
    //   res.locals.demo = true;

    //   const userId = await requestDemoLogin();

    //   console.log(userId);

    //   if (userId) {
    //     loginUser(req, res, { userId });
    //     req.session.save((err) => {
    //       if (err) return next(err);
    //       return res.redirect('/');
    //     });
    //   } else {
    //     res.locals.demo = false;
    //   }
    // } else {
    //   // if already logged in, attempt redirect to /
    //   // else do nothing
    //   if (req.session.auth) {
    //     return res.redirect('/');
    //   }
    // }
  })
);

router.post('/logout', (req, res) => {
  logoutUser(req, res);
  return res.redirect('/login');
});



module.exports = router;