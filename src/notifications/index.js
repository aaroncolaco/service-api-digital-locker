'use strict';

const lib = require('./lib');

module.exports = {
  gcmMesage: (to, notification) => lib.gcmMesage(to, notification), // using node-gcm
  notify : (to, notification) => lib.notify(to, notification) // using firebase
};
