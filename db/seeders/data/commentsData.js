const faker = require('faker');
const LoremIpsum = require('lorem-ipsum').LoremIpsum;

const { stories, numStories } = require('./storiesData');
const { numUsers } = require('./usersData');

const minSentencePerComment = 1;
const maxSentencePerComment = 5;
const maxWordsTitle = 3;

const numComments = numStories * 5;

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const comments = [];

for (let i = 0; i < numComments; i++) {
  const storyIndex = Math.floor(Math.random() * numStories);
  comments.push(
    {
      storyId: storyIndex + 1,
      userId: stories[storyIndex].userId,
      title: lorem.generateWords(Math.floor(Math.random() * maxWordsTitle) + 1),
      commentText: lorem
        .generateSentences(Math.floor(Math.random() * (maxSentencePerComment - minSentencePerComment + 1)) + minSentencePerComment),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
}

module.exports = { comments };