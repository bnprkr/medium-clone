const faker = require('faker');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const { username, email, password } = require('../../../config').user;

// parameters
const numUsers = 10;

// create users array
const users = [];

users.push(
  {
    username, 
    email,
    hashedPassword: bcrypt.hashSync(password, 10),
    createdAt: new Date(),
    updatedAt: new Date()
  }
);

for (let i = 0; i < numUsers - 1; i++) {
  users.push(
    {
      'username': faker.internet.userName(),
      'email': faker.internet.email(),
      hashedPassword: bcrypt.hashSync(faker.internet.password()),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
}

module.exports = { users, numUsers };