const environment = process.env.NODE_ENV || "development";

let url = "http://localhost:8080";
if (environment === "production") {
  url = "https://lorem-ipsum-medium.herokuapp.com";
}

module.exports = {
  environment,
  url,
  port: process.env.PORT || 8080,
  db: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.DB_HOST,
  },
  user: {
    username: process.env.USER_USERNAME,
    email: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
};
