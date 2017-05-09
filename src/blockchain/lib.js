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
    const txHash = web3.eth.sendTransaction(data, (err, address) => {
      if (err)
        return reject(err);

      console.log(address, txHash);
      return resolve(txHash);
    });
  });
};

module.exports = {
  seedAccount
};
