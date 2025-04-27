'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      Note.belongsTo(models.Application, {
        foreignKey: 'applicationId',
        as: 'Application',
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users' },
      onDelete: 'CASCADE',
    }
  }, {
    sequelize, 
    modelName: 'Note',
    tableName: 'Notes',
    timestamps: true,
    schema: process.env.NODE_ENV === 'production' ? process.env.SCHEMA : undefined,
  });

  return Note;
};

