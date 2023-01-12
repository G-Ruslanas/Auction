let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  return users;
};

const removeUser = (userId) => {
  users = users.filter((user) => user.userId !== userId);
  return users;
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

module.exports = { addUser, removeUser, getUser };
