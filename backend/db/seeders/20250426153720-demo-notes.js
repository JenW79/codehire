"use strict";
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}
options.tableName = 'Notes'; 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      options,
      [
        {
          applicationId: 1,
          content: "Reached out via email, awaiting response.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          applicationId: 1,
          content: "Scheduled a technical interview for next week.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          applicationId: 2,
          content: "Recruiter sent coding challenge, due in 3 days.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, null, {});
  },
};
