'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Story, { foreignKey: 'userId' });
      User.hasMany(models.StoryLike, { foreignKey: 'userId' });
      User.hasMany(models.Comment, { foreignKey: 'userId' });
      User.hasMany(models.CommentLike, { foreignKey: 'userId' });
      User.hasMany(models.Follow, { foreignKey: 'userId' });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};