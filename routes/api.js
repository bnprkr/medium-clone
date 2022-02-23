// - POST api/stories/:storyId/like
// - DELETE /api/stories/:storyId/like
// - POST /api/comments/:commentId/like
// - DELETE /api/comments/:commentId/like

// - POST /api/users/:userId/follow/:userId
// - DELETE /api/users/:userId/follow/:userId

// TODO add to me.js:
// POST /me/:storyId/delete

const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils'); 
const { userValidators, loginValidators } = require('./validators')
const { loginUser, requireAuth } = require('../auth');
const { Story, Comment, User, StoryLike, CommentLike, Follow, sequelize } = require('../db/models');
const { Op } = require('sequelize');

const router = express.Router();

router.use(requireAuth);


// NOTE - BASIC ROUTES FOR NOW, MORE NEEDED ON HOW TO IMPLEMENT THESE ROUTES
// AND SO HOW TO HANDLE SUCCESS/FAILURE FOR EACH ROUTE...

router.post('/stories/:storyId/like',
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const storyId = req.params.storyId;

    const like = await StoryLike.findOne({
      where: {
        userId,
        storyId,
      }
    });

    if (!like) {
      // create like
      const newLike = await StoryLike.create({ userId, storyId });

      if (newLike) {
        return res.json({ success: true });
      } else {
        // TODO add error handling for failed like creation...
      }
      
    } else {
      return res.json({ success: false });
    }

  })
);

module.exports = router