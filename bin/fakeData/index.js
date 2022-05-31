const faker = require('faker');
const bcrypt = require('bcryptjs');

const db = require('../../db/models');
const { numUsers } = require('../../db/seeders/data/usersData');
const { 
  lorem, 
  maxWordsTitle, 
  minParasPerStory, 
  maxParasPerStory 
} = require('../../db/seeders/data/storiesData');

// use this for now, may wish to calculate based on current avg per user..
const numStories = 15;

// createUser
async function createUser() {
  // returns a randomly generated user with email/username/hashedPassword
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

async function createStories(user, num = numStories) {
  // create stories
  const stories = [];

  for (let i = 0; i < num; i++) {
    stories.push(
      {
        userId: user.id,
        title: lorem.generateWords(Math.floor(Math.random() * maxWordsTitle) + 1),
        storyText: lorem
          .generateParagraphs(Math.floor(Math.random() * (maxParasPerStory - minParasPerStory + 1)) + minParasPerStory),
      }
    );
  }

  // create story likes


  // create story comments


  // 

  // add stories to database
  for (const story of stories) {
    await db.Story.create(story);
  }
}

function addStoryLikes() {

}

module.exports = {
  createUser,
  createStories
};