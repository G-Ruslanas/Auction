let users = [];

const addUser = ({ id, name, room }) => {
  const user = { id, name, room };
  users.push(user);
  return users;
};

const removeUser = (username) => {
  const filtered = users.filter((user) => user.name !== username);
  users = filtered;
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUsersInRoom };
