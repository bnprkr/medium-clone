const db = require("./db/models");
const { deleteUser } = require("./bin/demoUser");

const loginUser = (req, res, user) => {
  req.session.auth = {
    userId: user.id,
  };

  // if demo user add demo flag to auth object
  if (user.demo === true) {
    req.session.auth.demo = true;
  }
};

const logoutUser = async (req, res) => {
  // if account is a demo account
  // delete account on logout
  // new demo login will create new account
  if (req.session.auth.demo === true) {
    const { userId } = req.session.auth;
    await deleteUser(userId);
  }

  delete req.session.auth;
};

const restoreUser = async (req, res, next) => {
  if (req.session.auth) {
    const { userId } = req.session.auth;

    try {
      const user = await db.User.findByPk(userId);

      if (user) {
        res.locals.authenticated = true;
        res.locals.user = user;
        next();
      } else {
        delete req.session.auth;
        res.locals.authenticated = false;
        next();
      }
    } catch (err) {
      res.locals.authenticated = false;
      next(err);
    }
  } else {
    res.locals.authenticated = false;
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (!res.locals.authenticated) {
    return res.redirect("/login");
  }

  return next();
};

module.exports = {
  loginUser,
  logoutUser,
  restoreUser,
  requireAuth,
};
