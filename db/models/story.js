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
    }
  }
  Story.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    storyText: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Story',
  });
  return Story;
};