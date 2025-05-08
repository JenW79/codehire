// models/savedJob.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SavedJob extends Model {
    static associate(models) {
      SavedJob.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
      });
    }
  }

  SavedJob.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    jobId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: DataTypes.STRING,
    company: DataTypes.STRING,
    location: DataTypes.STRING,
    applyUrl: DataTypes.STRING,
    savedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'SavedJob',
    tableName: 'SavedJobs',
    timestamps: true,
    schema: process.env.NODE_ENV === 'production' ? process.env.SCHEMA : undefined,
  });

  return SavedJob;
};