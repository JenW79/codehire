"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
options.tableName = "Applications";

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
          userId: 1,
          companyName: "OpenAI",
          positionTitle: "Software Engineer",
          status: "Pending",
          appliedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          companyName: "Meta",
          positionTitle: "Frontend Developer",
          status: "Interview",
          appliedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          companyName: "Google",
          positionTitle: "Data Analyst",
          status: "Offer",
          appliedAt: new Date(),
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
