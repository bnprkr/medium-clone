const faker = require('faker');
const bcrypt = require('bcryptjs');

// createUser
async function createUser() {
  // returns a randomly generated user with email/username/password

  const password = faker.internet.password();

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  })

  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    hashedPassword,
  }
}

function createStory() {
  // creates a story
}

function addStoryLikes() {

}

module.exports = {
  createUser,
  
};