const faker = require('faker');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const { username, email, password } = require('../../config').user;

console.log(typeof username, username, typeof password, password);

console.log(faker.internet.userName());

const users = [];

users.push(
  {
    username, 
    email,
    password
  }
);



module.exports = { users, };