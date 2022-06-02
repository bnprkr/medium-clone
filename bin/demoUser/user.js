const faker = require('faker');
const bcrypt = require('bcryptjs');

const db = require('../../db/models');
const { Op } = db.Sequelize;
const { user } = require('../../config');
const { storyLikes } = require('../../db/seeders/data');
const { numUsers } = require('../../db/seeders/data/usersData');

async function createUser() {
  // returns a randomly generated user with email/username/hashedPassword
  const password = faker.internet.password();

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  })

  const user = await db.User.create({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    hashedPassword,
    demo: true,
  });

  return user;
}

async function deleteUser(userId) {
  // throw error if trying to delete non-demo user
  const user = await db.User.findByPk(userId);
  if (!user.demo) throw new Error('Cannot delete non-demo account');

  // get array of ids for seeded users
  const users = [];
  for (let i = 1; i <= numUsers; i++) {
    users.push(i);
  }

  // get story ids of stories by userId
  const storyIds = await db.Story.findAll({
    raw: true,
    attributes: ['id'],
    where: {
      userId
    }
  }).then((ids) => {
    return ids.map(obj => obj.id);
  });

  // delete likes from all userIds stories OR by userId on any stories
  await db.StoryLike.destroy({ where: { [Op.or]: [{ storyId: { [Op.in]: storyIds }}, userId] } });
  // delete comments from all userIds stories OR by userId on any stories
  await db.Comment.destroy({ where: { [Op.or]: [{ storyId: { [Op.in]: storyIds }}, userId] } });

  // delete all stories owned by userId, follows by userID and finally delete user
  await db.Story.destroy({ where: { id: { [Op.in]: storyIds } } });
  await db.Follow.destroy({ where: { userId } });
  await db.User.destroy({ where: { id: userId } });
}

module.exports = {
  createUser, 
  deleteUser
}