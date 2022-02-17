'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Story.belongsTo(models.User, { foreignKey: 'userId' });
      Story.hasMany(models.StoryLike, { foreignKey: 'storyId' });
      Story.hasMany(models.Comment, { foreignKey: 'storyId' });
    }
  }
  Story.init({
    userId: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    storyText: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
  }, {
    sequelize,
    modelName: 'Story',
  });
  return Story;
};