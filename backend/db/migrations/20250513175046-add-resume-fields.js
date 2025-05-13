'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.tableName = 'Resumes';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(options, 'name', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(options, 'jobTitle', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(options, 'education', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(options, 'skills', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn(options, 'summary', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn(options, 'experience', {
      type: Sequelize.JSON,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, 'name');
    await queryInterface.removeColumn(options, 'jobTitle');
    await queryInterface.removeColumn(options, 'education');
    await queryInterface.removeColumn(options, 'skills');
    await queryInterface.removeColumn(options, 'summary');
    await queryInterface.removeColumn(options, 'experience');
  },
};
