module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  db: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.DB_HOST
  },
  user: {
    username: process.env.USER_USERNAME,
    email: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD
  },
  session: {
    secret: process.env.SESSION_SECRET
  }
}