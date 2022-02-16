'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, { foreignKey: 'userId' });
      Comment.belongsTo(models.Story, { foreignKey: 'storyId' });
      Comment.hasMany(models.CommentLike, { foreignKey: 'commentId' });
    }
  }
  Comment.init({
    storyId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    commentText: {
      type: DataTypes.TEXT,
      validate: {
        notNull: true,
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};