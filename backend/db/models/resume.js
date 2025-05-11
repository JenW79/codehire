"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Resume extends Model {
    static associate(models) {
      Resume.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  Resume.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Resume",
      tableName: "Resumes",
      timestamps: true,
      schema:
        process.env.NODE_ENV === "production" ? process.env.SCHEMA : undefined,
    }
  );

  return Resume;
};
