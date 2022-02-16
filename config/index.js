module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST
  },
  user: {
    username: process.env.USER_USERNAME,
    email: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD
  }
}