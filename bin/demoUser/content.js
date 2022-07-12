const db = require("../../db/models");
const { numUsers } = require("../../db/seeders/data/usersData");
const {
  lorem,
  maxWordsTitle,
  minParasPerStory,
  maxParasPerStory,
} = require("../../db/seeders/data/storiesData");
const {
  minSentencePerComment,
  maxSentencePerComment,
  maxWordsTitle: maxWordsCommentTitle,
} = require("../../db/seeders/data/commentsData");

async function generateContent(user) {
  // get userId
  const userId = user.id;

  // create stories and get story ids
  const storyIds = await createStories(userId);

  // generate and create likes, comments, follows on db
  await createStoryLikes(storyIds);
  await createComments(storyIds);
  await createFollows(userId);
}

async function createStories(userId) {
  // CREATE STORIES
  const stories = [];

  // generate 11 to 19 stories
  const numStories = 11 + Math.floor(Math.random() * (20 - 11));

  for (let i = 0; i < numStories; i++) {
    stories.push({
      userId,
      title: lorem.generateWords(Math.floor(Math.random() * maxWordsTitle) + 1),
      storyText: lorem.generateParagraphs(
        Math.floor(Math.random() * (maxParasPerStory - minParasPerStory + 1)) +
          minParasPerStory
      ),
    });
  }

  // add stories to db
  await db.Story.bulkCreate(stories);

  // get and return story ids
  const storyIds = await db.Story.findAll({
    raw: true,
    attributes: ["id"],
    where: {
      userId,
    },
  }).then((ids) => {
    return ids.map((obj) => obj.id);
  });

  return storyIds;
}

async function createStoryLikes(storyIds) {
  const storyLikes = [];

  // loop over storyIds and add likes for each one
  for (const id of storyIds) {
    // 4 to 75 story likes
    const numStoryLikes = 4 + Math.floor(Math.random() * (76 - 4));
    for (let i = 0; i < numStoryLikes; i++) {
      storyLikes.push({
        // all likes come from same user as made-up data
        userId: 2,
        storyId: id,
      });
    }
  }

  // add story likes to db
  await db.StoryLike.bulkCreate(storyLikes);
}

async function createComments(storyIds) {
  const comments = [];

  // loop over storyIds and add likes for each one
  for (const id of storyIds) {
    // 2 to 8 comments per story
    const numStoryComments = 2 + Math.floor(Math.random() * (9 - 2));

    for (let i = 0; i < numStoryComments; i++) {
      comments.push({
        storyId: id,
        // comments all belong to seeded users 1-10
        userId: Math.floor(Math.random() * numUsers) + 1,
        title: lorem.generateWords(
          Math.floor(Math.random() * maxWordsCommentTitle) + 1
        ),
        commentText: lorem.generateSentences(
          Math.floor(
            Math.random() * (maxSentencePerComment - minSentencePerComment + 1)
          ) + minSentencePerComment
        ),
      });
    }
  }

  // add comments to db
  await db.Comment.bulkCreate(comments);
}

async function createFollows(userId) {
  const follows = [];

  // create array of the seeded users
  // will select users to follow from these
  const users = [];
  for (let i = 1; i <= numUsers; i++) {
    users.push(i);
  }

  // following 3 to 8 users
  const numFollowing = 3 + Math.floor(Math.random() * (9 - 3));

  for (let i = 0; i < numFollowing; i++) {
    const index = Math.floor(Math.random() * users.length);
    const followId = users[index];
    // remove selected user from users array
    users.splice(index, 1);

    follows.push({
      userId,
      followingUserId: followId,
    });
  }

  // add follows to db
  await db.Follow.bulkCreate(follows);
}

module.exports = {
  generateContent,
};
