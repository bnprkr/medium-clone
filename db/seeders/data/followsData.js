const { numUsers } = require("./usersData");

const userIds = [];

for (let i = 1; i <= numUsers; i++) {
  userIds.push(i);
}

const minFollowing = 3;
const maxFollowing = 8;

const follows = [];

for (let i = 1; i <= numUsers; i++) {
  const numFollowing =
    Math.floor(Math.random() * (maxFollowing - minFollowing + 1)) +
    minFollowing;
  const users = userIds.slice();
  users.splice(i - 1, 1);
  for (let j = 0; j < numFollowing; j++) {
    const randIndex = Math.floor(Math.random() * (numUsers - j - 1));
    const sampledId = users.splice(randIndex, 1)[0];
    follows.push({
      userId: i,
      followingUserId: sampledId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

module.exports = { follows };
