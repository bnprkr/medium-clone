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
const {
  minSentencePerComment, 
  maxSentencePerComment, 
  maxWordsTitle: maxWordsCommentTitle,
} = require('../../db/seeders/data/commentsData');

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

async function generateContent(user) {
  const userId = user.id;

  // CREATE STORIES
  const stories = [];

  // generate 11 to 19 stories
  const numStories = 11 + Math.floor(Math.random() * (20 - 11));

  for (let i = 0; i < numStories; i++) {
    stories.push(
      {
        userId,
        title: lorem.generateWords(Math.floor(Math.random() * maxWordsTitle) + 1),
        storyText: lorem
          .generateParagraphs(Math.floor(Math.random() * (maxParasPerStory - minParasPerStory + 1)) + minParasPerStory),
      }
    );
  }

  // add stories to db
  await db.Story.bulkCreate(stories);

  // CREATE STORY LIKES AND COMMENTS

  // get storyIds for all stories by this user...
  const storyIds = await db.Story.findAll({
    raw: true,
    attributes: ['id'],
    where: {
      userId
    }
  }).then((ids) => {
    return ids.map(obj => obj.id);
  });

  const storyLikes = [];
  const comments = [];

  // loop over storyIds and add likes for each one
  for (const id of storyIds) {
    // 4 to 75 story likes
    const numStoryLikes = 4 + Math.floor(Math.random() * (76 - 4));
    for (let i = 0; i < numStoryLikes; i++) {
      storyLikes.push(
        {
          // all likes come from same user as made-up data 
          userId: 2,
          storyId: id
        }
      );
    }

    // 2 to 8 comments per story
    const numStoryComments = 2 + Math.floor(Math.random() * (9 - 2));

    for (let i = 0; i < numStoryComments; i++) {
      comments.push(
        {
          storyId: id,
          // comments all belong to seeded users 1-10
          userId: Math.floor(Math.random() * numUsers) + 1,
          title: lorem.generateWords(Math.floor(Math.random() * maxWordsCommentTitle) + 1),
          commentText: lorem
            .generateSentences(Math.floor(Math.random() * (maxSentencePerComment - minSentencePerComment + 1)) + minSentencePerComment),
        }
      );
    }
  }

  // add story likes to db
  await db.StoryLike.bulkCreate(storyLikes);
  await db.Comment.bulkCreate(comments);

  // CREATE FOLLOWS

  const follows = [];

  // create array of the seeded users
  // will select users to follow from these
  const users = [];
  for (let i = 1; i <= 10; i++) {
    users.push(i);
  }

  // following 3 to 8 users
  const numFollowing = 3 + Math.floor(Math.random() * (9 - 3));

  for (let i = 0; i < numFollowing; i++) {
    const index = Math.floor(Math.random() * users.length);
    const followId = users[index];
    // remove selected user from users array
    users.splice(index, 1);

    follows.push(
      {
        userId,
        followingUserId: followId,
      }
    );
  }

  // add follows to db
  await db.Follow.bulkCreate(follows);
}

module.exports = {
  createUser,
  generateContent,
};