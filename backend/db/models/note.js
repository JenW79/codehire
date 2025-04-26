'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      Note.belongsTo(models.Application, {
        foreignKey: 'applicationId',
      });
    }
  }

  Note.init({
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Applications',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize, 
    modelName: 'Note',
    tableName: 'Notes',
    timestamps: true,
    schema: process.env.NODE_ENV === 'production' ? process.env.SCHEMA : undefined,
  });

  return Note;
};

