const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils'); 
const { userValidators, loginValidators } = require('./validators')
const { loginUser, requireAuth } = require('../auth');
const { Story, Comment, User, StoryLike, CommentLike, Follow, sequelize } = require('../db/models');
const { Op } = require('sequelize');
const { numUsers } = require('../db/seeders/data/usersData');

// array of ids for seeded users
const users = [];
for (let i = 1; i <= numUsers; i++) {
  users.push(i);
}

const router = express.Router();

router.use(requireAuth);

const charsInPreview = 120;

router.get('/@:username/stories',
  asyncHandler(async (req, res) => {

    console.log(req.params.username)

    const user = await User.findOne({ where: { username: req.params.username } })
    const userId = user.id;

    const stories = await Story.findAll({
      where: { userId },
      include: [User, StoryLike, Comment],
    });

    const storiesData = stories.map(story => {
      return {
        title: story.title,
        authorId: story.userId,
        author: story.User.username,
        sample: story.storyText.slice(0, charsInPreview),
        numLikes: story.StoryLikes.length,
        numComments: story.Comments.length,
      }
    });

    return res.send(storiesData);
  })
);

router.get('/@:username/stories/:storyId',
  asyncHandler(async (req, res) => {
    const storyId = parseInt(req.params.storyId);
    const currentUserId = res.locals.user.id;

    const story = await Story.findOne({ 
      where: { id: storyId },
      include: [
        User, 
        StoryLike, 
        { model: Comment, 
          where: {
            // exclude comments from demo/registered users
            userId: users.concat(currentUserId)
          },
          include: User 
        }
      ],
    });

    const comments = story.Comments.map(comment => {
      return {
        author: comment.User.username,
        title: comment.title,
        text: comment.commentText,
      }
    });

    const liked = story.StoryLikes.some(like => {
      return (like.storyId === storyId && like.userId === currentUserId);
    });

    const storyData = {
      liked,
      myStory: false,
      storyId,
      title: story.title,
      text: story.storyText,
      numLikes: story.StoryLikes.length,
      comments,
    };

    return res.render('story', {
      story: storyData
    });
  })
);

module.exports = router;