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
const { numUsers } = require('../db/seeders/data/usersData');
const { redirect } = require('express/lib/response');
const { url } = require('../config');

const charsInPreview = 180;
const numStorysFeed = 10;

// array of ids for seeded users
const users = [];
for (let i = 1; i <= numUsers; i++) {
  users.push(i);
}

const router = express.Router();

router.use(requireAuth);

router.get('/',
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
      include: [
        User, 
        StoryLike, 
        {
          model: Comment,
          // exclude comments from demo/registered users
          where: {
            userId: users.concat(userId)
          }
        }
      ]
    });

    const storiesData = stories.map(story => {
      return {
        id: story.id,
        title: story.title,
        authorId: story.userId,
        author: story.User.username,
        sample: story.storyText.slice(0, charsInPreview) + '...',
        numLikes: story.StoryLikes.length,
        numComments: story.Comments.length,
      }
    });

    return res.render('feed', {
      title: 'Home',
      stories: storiesData
    });

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

    const storiesData = stories.map(story => {
      return {
        id: story.id,
        title: story.title,
        authorId: story.userId,
        author: story.User.username,
        sample: story.storyText.slice(0, charsInPreview) + '...',
        numLikes: story.StoryLikes.length,
        numComments: story.Comments.length,
      }
    });

    return res.render('my-stories', {
      title: 'My Stories',
      stories: storiesData
    });

  })
);

router.get('/create-story',
  asyncHandler(async (req, res) => {
    return res.render('create-story');
  })
)

router.post('/create-story',
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const { title } = req.body;
    let { storyText } = req.body;

    const regex = /(\r\n){1,}/g;
    storyText = storyText.replace(regex, '\n');

    const story = await Story.create({ userId, title, storyText });

    if (story) {
      res.status(201).redirect('/me/stories');
    } else {
      // shouldn't be possible to reach here
      return res.status(403).end();
    }
  })
)

router.get('/me/stories/:storyId',
  asyncHandler(async (req, res) => {
    
    // TODO add handling to check if :storyId belongs to currently logged in user, 
    // redirect to /:username/stories/:storyId if not

    const storyId = parseInt(req.params.storyId);

    const username = res.locals.user.username;

    const story = await Story.findOne({ 
      where: { id: storyId },
      include: [User, StoryLike, { model: Comment, include: User }],
      order: [
        [Comment, 'createdAt', 'DESC']
      ]
    });

    const comments = story.Comments.map(comment => {
      return {
        author: comment.User.username,
        title: comment.title,
        text: comment.commentText,
      }
    });

    const liked = story.StoryLikes.some(like => {
      return (like.storyId === storyId && like.userId === res.locals.user.id);
    });

    const storyData = {
      myStory: true,
      liked,
      storyId,
      title: story.title,
      text: story.storyText,
      numLikes: story.StoryLikes.length,
      comments,
    };

    return res.render('story', {
      username,
      story: storyData
    });
  })
);

router.get('/me/stories/:storyId/edit',
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const storyId = req.params.storyId;

    // will only find story if exists and belongs to current user
    const story = await Story.findOne({ where: { id: storyId, userId } });

    if (story) {
      const storyData = {
        title: story.title,
        text: story.storyText,
      }
      
      return res.render('story-edit', {
        storyId,
        story: storyData
      });
    } else {
      return res.status(403).end();
    }

  })
);

router.post('/me/stories/:storyId/edit',
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const storyId = req.params.storyId;
    
    // will only find story if exists and belongs to current user
    const story = await Story.findOne({ where: { id: storyId, userId } });

    if (story) {
      // get submitted story data from body
      const { title } = req.body;
      let { storyText } = req.body;

      const regex = /(\r\n){1,}/g;
      storyText = storyText.replace(regex, '\n');

      // update story with edited info
      await story.update({ title, storyText })
      .then(() => {
        return res.redirect(`/me/stories/${storyId}`);
      });
    } else {
      // shouldn't be possible to reach here
      return res.status(403).end();
    }
  })
);

router.get('/me/stories/:storyId/delete',
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;

    // will only find story if exists and belongs to current user
    const story = await Story.findOne({ where: { id: req.params.storyId, userId } });

    if (story) {
      // delete likes, comments and story
      const storyId = req.params.storyId;
      await StoryLike.destroy({ where: { storyId } });
      await Comment.destroy({ where: { storyId } });
      await story.destroy();
      return res.status(204).redirect('/me/stories');
    } else {
      // either story does not exist or logged in user does not own this story
      return res.status(403).end();
    }

  })
);

router.get('/me/follow',
  asyncHandler(async (req, res) => {
    // get users currently logged in user is following
    // for each user get:
    // username, followers, following, #stories authored

    const userId = res.locals.user.id;
      
    const following = await Follow.findAll({
      where: { userId },
      include: [User]
    });

    const followingData = following.map(follow => {
      return {
        id: follow.User.id,
        username: follow.User.username,
        // following: follow.User.Follows.length
      }
    })

    // get users currently logged in user is not following

    const followingIds = following.map(follow => follow.followingUserId);

    const notFollowing = await User.findAll({
      where: { 
        id: {
           [Op.notIn]: [...followingIds, userId],
           // don't allow to follow demo/registered users
           [Op.in]: users
        } 
      }
    });

    const notFollowingData = notFollowing.map(user => {
      return {
        id: user.id,
        username: user.username
      }
    });

    return res.render('follow', 
    { 
      following: followingData, 
      notFollowing: notFollowingData,
      url
    });
  })
);

module.exports = router;
