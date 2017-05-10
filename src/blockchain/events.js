'use strict';

const _ = require('lodash');
const fs = require('fs');
const Web3 = require('web3');

const config = require('../config');
const notifier = require('../notifications');
const userHelpers = require('../users/helpers');

const ABI = fs.readFileSync(__dirname + "/ABI.txt", "utf8").trim();
const address = fs.readFileSync(__dirname + "/contractAddress.txt", "utf8").trim();

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.getGethUrl()));
const contractInstance = web3.eth.contract(JSON.parse(ABI)).at(address);

const allEvents = contractInstance.allEvents();
allEvents.watch((err, result) => {
  if (err) {
    return logError("allEvents", err);
  }
  console.log("Result: ", JSON.stringify(result) + "\n");
  console.log("Result Args: ", JSON.stringify(result.args) + "\n");

  eventResultToData(result)
    .then(eventData => {
      console.log(`Notification: ${JSON.stringify(eventData.message)} \n`);
      notifyUser(eventData.eventName, eventData.message, eventData.receiverEthAccount);
    })
    .catch(err => logError('eventResultToData', err));
});

// helper functions
const eventResultToData = (eventResult) => {

  const eventName = eventResult.event;

  const receiverEthAccount = eventResult.args.to;
  const senderEthAccount = eventResult.args.from;

  let to = receiverEthAccount;

  if (!to) {
    to = senderEthAccount;
  }


  return userHelpers.findUser({ ethAccount: to })
    .then(user => {
      if (!user) {
        return Promise.reject(Error("Cannot find sender Ethereum user account: " + senderEthAccount));
      }

      const data = {
        body: eventName,
        title: web3.toAscii(eventResult.args.docName),
        "content-available": "1"
      };

      const message = {
        data
      };

      const resultData = {
        eventName,
        message,
        receiverEthAccount
      };

      return Promise.resolve(resultData);
    })
    .catch(err => {
      logError(eventName, err);
      return Promise.reject(err);
    });
};

const notifyUser = (eventName, message, receiverEthAccount) => {
  return userHelpers.findUser({ ethAccount: receiverEthAccount })
    .then(user => {
      if (!user) {
        return logError(eventName, Error("Cannot send notification to unknown Ethereum user account: " + receiverEthAccount));
      }
      notifier.gcmMesage(user.firebaseToken, message)
        .then(response => console.log("Then Block: ", JSON.stringify(response)));
    })
    .catch(err => logError(eventName, err));
};

const logError = (eventName, error) =>
  console.error("Error in: " + eventName + "\n" + error + "\n\n");

module.exports = {};
