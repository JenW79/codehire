'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'SavedJobs';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        jobId: 'D7FDM6ekNhPC_BCVAAAAAA==', // match mock
        source: 'jsearch',
        title: 'Frontend Developer',
        company: 'Lensa Inc.',
        location: 'Remote',
        applyUrl: 'https://www.linkedin.com/jobs/view/...mock',
        savedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        jobId: '12345',
        source: 'remotive',
        title: 'React Engineer',
        company: 'Remotive Inc.',
        location: 'Remote/US',
        applyUrl: 'https://remotive.com/job/12345',
        savedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SavedJobs';
    return queryInterface.bulkDelete(options, null, {});
  }
};
