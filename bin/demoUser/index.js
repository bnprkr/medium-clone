const { createUser, deleteUser } = require('./user.js');
const { generateContent } = require('./content.js');

async function generateDemoAccount() {
  const user = await createUser();
  await generateContent(user);
  return user;
}

module.exports = {
  generateDemoAccount,
  deleteUser
}
