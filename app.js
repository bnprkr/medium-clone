const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const store = require("connect-pg-simple")(session);
const cookieParser = require("cookie-parser");
const path = require("path");

const { secret } = require("./config").session;
const authRoutes = require("./routes/user");
const userRoutes = require("./routes/me");
const storyRoutes = require("./routes/story");
const apiRoutes = require("./routes/api");
const { restoreUser } = require("./auth");

const app = express();
app.set("view engine", "pug");

// middleware using the header set by heroku
// (request.secure will always be false on heroku hosted apps)
// and forwards to https if already secure
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(secret));
app.use(
  session({
    // note secure cookie needed in production with expiry time...
    store: new store({
      createTableIfMissing: true,
    }),
    secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(restoreUser);
app.use(authRoutes);
app.use(userRoutes);
app.use(storyRoutes);
app.use("/api", apiRoutes);

module.exports = app;
