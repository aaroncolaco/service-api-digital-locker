'use strict';

const lib = require('./lib');
const events = require('./events');

module.exports = {
  seedAccount : (amount, toAccount) => lib.seedAccount(amount, toAccount)
};
