'use strict';

const { users, stories, comments } = require('./data');

module.exports = {
  async up (queryInterface, Sequelize) {
    /*
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', users, {});  
    await queryInterface.bulkInsert('Stories', stories, {});
    return queryInterface.bulkInsert('Comments', comments, {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
    return queryInterface.bulkDelete('Stories', null, {});
  }
};
