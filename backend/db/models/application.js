// backend/models/application.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class Application extends Model {}

Application.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    positionTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Application",
    tableName: "Applications",
    timestamps: true,
    schema: process.env.NODE_ENV === 'production' ? process.env.SCHEMA : undefined,
  },

  (Application.associate = (models) => {
    Application.hasMany(models.Note, {
      foreignKey: "applicationId",
      onDelete: "CASCADE",
      hooks: true,
    });
  })
);

module.exports = Application;
