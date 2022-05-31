const faker = require('faker');
const bcrypt = require('bcryptjs');

// createUser
async function createUser() {
  // returns a randomly generated user with email/username/password

  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    hashedPassword: await bcrypt.hash(faker.internet.password()),
  }
}

function createStory() {
  // creates a story
}

function addStoryLikes() {

}