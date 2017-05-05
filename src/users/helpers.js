'use strict';

const User = require('./model');

const createUser = (attributes) => {
  const newUser = User(attributes);
  return newUser.save();
};

const deleteUser = (id) => User.findByIdAndRemove(id);

const findUser = (where) => User.findOne(where);

const searchUsers = (limit, where) => {
  limit = Math.min(Math.max(limit, 1), 100); // between [0,100] only

  return User.find(where)
    .limit(limit)
    .sort({ ethAccount: 1 });
};

const updateUser = (where, attributes) => {
  return User.findOne(where)
    .then(user => {
      if (!user) {
        return Promise.resolve(false);
      }
      return user.update(attributes);
    }, err => {
      return Promise.reject(err);
    });
};

module.exports = {
  createUser,
  deleteUser,
  findUser,
  searchUsers,
  updateUser
};
