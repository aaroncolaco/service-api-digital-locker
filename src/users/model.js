'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  ethAccount: {
    type: String,
    minlength: [10, 'Text less than 10 char'],
    required: [true, '{PATH} is required'],
    trim: true,
    unique: true
  },
  firebaseToken: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true
  },
}, {
  timestamps: true
});

userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'ethAccount', 'firebaseToken']);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
