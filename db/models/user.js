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
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};