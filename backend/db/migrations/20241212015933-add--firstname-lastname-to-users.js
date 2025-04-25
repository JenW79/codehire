'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Users'; 
    await queryInterface.addColumn(
      options,
      'firstName',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
    await queryInterface.addColumn(
      options,
      'lastName',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users'; // Target the correct table
    await queryInterface.removeColumn(options, 'firstName');
    await queryInterface.removeColumn(options, 'lastName');
  }
};
