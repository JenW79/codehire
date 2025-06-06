"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      Application.belongsTo(models.User, { foreignKey: "userId" });
      Application.hasMany(models.Note, {
        foreignKey: "applicationId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }

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
      schema:
        process.env.NODE_ENV === "production" ? process.env.SCHEMA : undefined,
    }
  );

  return Application;
};
