'use strict';

const lib = require('./lib');
const events = require('./events');

module.exports = {
  getUserLogs: (where) => lib.getUserLogs(where),
  seedAccount : (amount, toAccount) => lib.seedAccount(amount, toAccount)
};
