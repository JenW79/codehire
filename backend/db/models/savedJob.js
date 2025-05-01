// models/savedJob.js
module.exports = (sequelize, DataTypes) => {
    const SavedJob = sequelize.define("SavedJob", {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      }
    });
  
    SavedJob.associate = models => {
      SavedJob.belongsTo(models.User, { foreignKey: "userId" });
    };
  
    return SavedJob;
  };
  