'use strict';

const _ = require('lodash');

const blockchain = require('../blockchain');
const helpers = require('./helpers');
const notifications = require('../notifications');


const addUser = (req, res) => {
  const attributes = reqToUserAttributes(req, res);

  return helpers.createUser(attributes)
    .then(user => res.status(201).json(user))
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not add user", err);
    });
};

const deleteUser = (req, res) => {

  const where = {
    _id: req.params.id
  };

  return helpers.deleteUser(where)
    .then(user => {
      if (!user) {
        return errorResponse(res, "Not found", Error("Not found"), 404);
      }
      res.status(200).json(user);
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not delete User", err);
    });
};

const updateUser = (req, res) => {
  const attributes = reqToUserAttributes(req, res);

  const where = {
    ethAccount: attributes.ethAccount
  };

  return helpers.updateUser(where, attributes)
    .then(user => {
      if (!user) {
        return errorResponse(res, "Not found", Error("Not found"), 404);
      }
      res.status(202).json(user);
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not update User", err);
    });
};


// helpers
const reqToUserAttributes = (req, res) => {

  if (!req.body.hasOwnProperty('ethAccount') || !_.isString(req.body.ethAccount)) {
    return errorResponse(res, "Bad Data. Bad ethAccount", Error("Bad Data. Bad ethAccount."), 400);
  } else if (!req.body.hasOwnProperty('firebaseToken') || !_.isString(req.body.firebaseToken)) {
    return errorResponse(res, "Bad Data. Bad firebaseToken", Error("Bad Data. Bad firebaseToken."), 400);
  }

  return ({
    ethAccount: req.body.ethAccount,
    firebaseToken: req.body.firebaseToken
  });
};

const errorResponse = (res, message, error, status = 500) =>
  res.status(status).json({ "status": status, "message": message, "error": error });


module.exports = {
  addUser,
  deleteUser,
  updateUser
};
