const { numUsers } = require('./usersData');

const LoremIpsum = require('lorem-ipsum').LoremIpsum;

const numStories = 150;
const maxWordsTitle = 4;
const minParasPerStory = 8;
const maxParasPerStory = 22;

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 12,
    min: 6
  },
  wordsPerSentence: {
    max: 12,
    min: 4
  }
});

stories = [];

for (let i = 0; i < numStories; i++) {
  stories.push(
    {
      userId: Math.floor(Math.random() * numUsers) + 1, 
      title: lorem.generateWords(Math.floor(Math.random() * maxWordsTitle) + 1),
      storyText: lorem
        .generateSentences(Math.floor(Math.random() * (maxParasPerStory - minParasPerStory + 1)) + minParasPerStory),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
}

module.exports = { stories };