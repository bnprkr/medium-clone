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
        return res.status(201).end();
      } else {
        // TODO error handling for failed like creation...
      }
      
    } else {
      // TODO error handling for like already exists... 
      // should only reach this route if like does not exist
    }

  })
);

router.delete('/stories/:storyId/like',
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const storyId = req.params.storyId;

    const like = await StoryLike.findOne({
      where: {
        userId,
        storyId,
      }
    });

    if (like) {
      await like.destroy()
      res.status(204).end();
    } else {
      // TODO handle error
      // should only reach this route if like exists
      // hence error if doesn't
    }

  })
);


router.post('/comments/:commentId/like',
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const commentId = req.params.commentId;

    const like = await CommentLike.findOne({
      where: {
        userId,
        commentId,
      }
    });

    if (!like) {
      // create like
      const newLike = await CommentLike.create({ userId, commentId });

      if (newLike) {
        return res.status(201).end();
      } else {
        // TODO error handling for failed like creation...
      }
      
    } else {
      // TODO error handling for like already exists... 
      // should only reach this route if like does not exist
    }

  })
);

router.delete('/stories/:commentId/like',
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const commentId = req.params.commentId;

    const like = await CommentLike.findOne({
      where: {
        userId,
        commentId,
      }
    });

    if (like) {
      await like.destroy()
      res.status(204).end();
    } else {
      // TODO handle error
      // should only reach this route if like exists
      // hence error if doesn't
    }

  })
);

router.post('/users/:userId/follow/:followId',
  asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const followingUserId = req.params.followId;

    const follow = await Follow.findOne({
      where: {
        userId,
        followingUserId,
      }
    });

    if (!follow) {
      // create like
      const newFollow = await Follow.create({ userId, followingUserId });

      if (newFollow) {
        return res.status(201).end();
      } else {
        // TODO error handling for failed follow creation...
      }
      
    } else {
      // TODO error handling for follow already exists... 
      // should only reach this route if follow does not exist
    }

  })
);

module.exports = router