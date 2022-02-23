// story related routes
// /@:username/stories
// /@:username/:storyId
// /@:username/:storyId/edit

const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils'); 
const { userValidators, loginValidators } = require('./validators')
const { loginUser, restoreUser, requireAuth } = require('../auth');
const { Story, Comment, User, StoryLike, CommentLike, Follow, sequelize } = require('../db/models');
const { Op } = require('sequelize');

const router = express.Router();

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

module.exports = router;