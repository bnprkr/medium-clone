const faker = require('faker');
const bcrypt = require('bcryptjs');

const db = require('../../db/models');
const { Op } = db.Sequelize;
const { user } = require('../../config');
const { storyLikes } = require('../../db/seeders/data');

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

  // get story ids
  const storyIds = await db.Story.findAll({
    raw: true,
    attributes: ['id'],
    where: {
      userId
    }
  }).then((ids) => {
    return ids.map(obj => obj.id);
  });

  await db.StoryLike.destroy({ where: { storyId: { [Op.in]: storyIds } } });
  await db.Comment.destroy({ where: { storyId: { [Op.in]: storyIds } } });
  await db.Story.destroy({ where: { id: { [Op.in]: storyIds } } });
  await db.Follow.destroy({ where: { userId } });
  await user.destroy();
  // await db.User.destroy({ where: { id: userId } });
}

module.exports = {
  createUser, 
  deleteUser
}