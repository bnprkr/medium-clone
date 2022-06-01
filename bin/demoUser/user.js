const faker = require('faker');
const bcrypt = require('bcryptjs');

const db = require('../../db/models');

async function createUser() {
  // returns a randomly generated user with email/username/hashedPassword
  const password = faker.internet.password();

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  })

  const user = await db.User.create({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    hashedPassword,
    demo: true,
  });

  return user;
}

async function deleteUser(user) {

}

module.exports = {
  createUser, 
  deleteUser
}