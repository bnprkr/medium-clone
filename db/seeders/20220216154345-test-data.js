"use strict";

const {
  users,
  stories,
  comments,
  storyLikes,
  // commentLikes,
  follows,
} = require("./data");

module.exports = {
  async up(queryInterface, Sequelize) {
    /*
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert("Users", users, {});
    await queryInterface.bulkInsert("Stories", stories, {});
    await queryInterface.bulkInsert("Comments", comments, {});
    await queryInterface.bulkInsert("StoryLikes", storyLikes, {});
    // await queryInterface.bulkInsert('CommentLikes', commentLikes, {});
    return queryInterface.bulkInsert("Follows", follows, {});
  },

  async down(queryInterface, Sequelize) {
    /*
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    // await queryInterface.bulkDelete('CommentLikes', null, {});
    await queryInterface.bulkDelete("StoryLikes", null, {});
    await queryInterface.bulkDelete("Comments", null, {});
    await queryInterface.bulkDelete("Stories", null, {});
    await queryInterface.bulkDelete("Follows", null, {});
    return queryInterface.bulkDelete("Users", null, {});
  },
};
