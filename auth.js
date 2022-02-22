const loginUser = (req, res, user) => {
  req.session.auth = {
    userId: user.id,
    username: user.username,
  };
};  

module.exports = {
  loginUser,
}