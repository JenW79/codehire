// backend/models/note.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Note extends Model {}

Note.init(
  {
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Applications",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Note",
    tableName: "Notes",
    timestamps: true,
  },
  (Note.associate = (models) => {
    Note.belongsTo(models.Application, {
      foreignKey: "applicationId",
    });
  })
);

module.exports = Note;
