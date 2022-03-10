let users = [];

const addUser = ({ id, name }) => {
  const user = { id, name };
  users.push(user);
  return users;
};

const removeUser = (username) => {
  const filtered = users.filter((user) => user.name !== username);
  console.log(filtered);
  users = filtered;
};

module.exports = { addUser, removeUser };
