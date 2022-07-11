const { numUsers } = require("./usersData");

const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const numStories = 50;
const maxWordsTitle = 4;
const minParasPerStory = 3;
const maxParasPerStory = 8;

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

stories = [];

for (let i = 0; i < numStories; i++) {
  stories.push({
    userId: Math.floor(Math.random() * numUsers) + 1,
    title: lorem.generateWords(Math.floor(Math.random() * maxWordsTitle) + 1),
    storyText: lorem.generateParagraphs(
      Math.floor(Math.random() * (maxParasPerStory - minParasPerStory + 1)) +
        minParasPerStory
    ),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  stories,
  numStories,
  lorem,
  numStories,
  maxWordsTitle,
  minParasPerStory,
  maxParasPerStory,
};
