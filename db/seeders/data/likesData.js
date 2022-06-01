const { numStories, stories } = require('./storiesData');
const { numComments, comments } = require('./commentsData');

const numStoryLikes = numStories * 55;
const numCommentLikes = numComments * 12;

const storyLikes = [];

for (let i = 0; i < numStoryLikes; i++) {
  const storyIndex = Math.floor(Math.random() * numStories);
  storyLikes.push(
    {
      userId: 2,
      storyId: storyIndex + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
}

const commentLikes = [];

for (let i = 0; i < numCommentLikes; i++) {
  const commentIndex = Math.floor(Math.random() * numComments);
  commentLikes.push(
    {
      userId: comments[commentIndex].userId,
      commentId: commentIndex + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
}

module.exports = { storyLikes, commentLikes }