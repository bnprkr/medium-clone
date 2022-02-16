'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoryLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StoryLike.belongsTo(models.User, { foreignKey: 'userId' });
      StoryLike.belongsTo(models.Story, { foreignKey: 'storyId' });
    }
  }
  StoryLike.init({
    userId: DataTypes.INTEGER,
    storyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StoryLike',
  });
  return StoryLike;
};