'use strict';

const fs = require('fs');
const Web3 = require('web3');

const config = require('../config');
const lib = require('./lib');

const ABI = fs.readFileSync(__dirname + "/ABI.txt", "utf8").trim();
const address = fs.readFileSync(__dirname + "/contractAddress.txt", "utf8").trim();

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.getGethUrl()));
const contractInstance = web3.eth.contract(JSON.parse(ABI)).at(address);

const seedAccount = (amount, toAccount) => {
  const data = {
    from: config.getAdminGethAccount(),
    to: toAccount,
    value: web3.toWei(amount, "ether") // amount of ether to send converted to wei
  };
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(data, (err, address) => {
      if (err)
        return reject(err);

      return resolve(address);
    });
  });
};

// get all events for certain user (logs)
const getUserLogs = (where) => {
  const allEvents = contractInstance.allEvents(where.index, where.filter);
  return new Promise((resolve, reject) => {
    allEvents.get((err, result) => {
      if (err) {
        logError("getUserLogs", err);
        return reject(err);
      }
      console.log("Result: ", JSON.stringify(result) + "\n");
      return resolve(result);
    });
  });
};

const logError = (eventName, error) =>
  console.error("Error in: " + eventName + "\n" + error + "\n\n");

module.exports = {
  getUserLogs,
  seedAccount
};
