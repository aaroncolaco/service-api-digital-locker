'use strict';

const _ = require('lodash');
const lightwallet = require('eth-lightwallet');

const blockchain = require('../blockchain');
const helpers = require('./helpers');
const notifications = require('../notifications');


const addUser = (req, res) => {
  const attributes = reqToUserAttributes(req, res);

  let txHash = null;

  return blockchain.seedAccount(1, attributes.ethAccount)
    .then(address => {
      txHash = address;
      return helpers.createUser(attributes);
    })
    .then(user => res.status(201).json({ user, txHash }))
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

const getUserLogs = (req, res) => {

  const where = {
    index: { from: req.query.ethAccount },
    filter: { fromBlock: parseInt(req.query.fromBlock), toBlock: parseInt(req.query.toBlock) }
  };

  if (req.query.hasOwnProperty('docName') || _.isString(req.query.docName)) {
    where.index.docName = req.query.docName;
  }

  return blockchain.getUserLogs(where)
    .then(logs => {
      if (logs.length === 0) {
        return errorResponse(res, "No logs found", Error("No logs found"), 404);
      }
      res.status(200).json(logs);
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not fetch User logs", err);
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

  const signature = req.body.signature;
  const recoveredAddress = "0x" + lightwallet.signing.recoverAddress(req.body.firebaseToken, signature.v, signature.r.data, signature.s.data).toString('hex');

  if (recoveredAddress !== req.body.ethAccount) {
    return errorResponse(res, "Bad Data. Ethereum Account does not match", Error("Bad Data. Ethereum Account does not match."), 400);
  }

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
  getUserLogs,
  updateUser
};
