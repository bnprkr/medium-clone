// routes specific to currently logged in user
// / homepage with story feed
// /me/stories 
// /me/follow

const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils'); 
const { userValidators, loginValidators } = require('./validators')
const { loginUser, restoreUser, requireAuth } = require('../auth');
const { Story, Comment, User, StoryLike, CommentLike, Follow, sequelize } = require('../db/models');
const { Op } = require('sequelize');

const charsInPreview = 120;
const numStorysFeed = 10;

const router = express.Router();

router.get('/', restoreUser, requireAuth,
  asyncHandler(async (req, res) => {

    // get 10 random stories of logged in user
    // with num likes and comments for each story

    // get following ids for currently logged in user
    // get stories authored by users followed by currently logged in user

    const userId = res.locals.user.id;

    const following = await Follow.findAll({
      attributes: ['followingUserId'],
      where: { userId }
    });

    const followingIds = following.map(follow => {
      return follow.followingUserId;
    })

    const stories = await Story.findAll({ 
      where: { userId: { [Op.in]: followingIds } },
      order: sequelize.random(),
      limit: numStorysFeed,
      include: [User, StoryLike, Comment]
    });

    const storyData = stories.map(story => {
      return {
        title: story.title,
        authorId: story.userId,
        author: story.User.username,
        sample: story.storyText.slice(0, charsInPreview),
        numLikes: story.StoryLikes.length,
        numComments: story.Comments.length,
      }
    });

    return res.send(storyData);
  })
);

router.get('/me/stories', 
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;

    const stories = await Story.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [User, StoryLike, Comment]
    });

    const storyData = stories.map(story => {
      return {
        title: story.title,
        authorId: story.userId,
        author: story.User.username,
        sample: story.storyText.slice(0, charsInPreview),
        numLikes: story.StoryLikes.length,
        numComments: story.Comments.length,
      }
    });

    return res.send(storyData);
  })
);

module.exports = router;
