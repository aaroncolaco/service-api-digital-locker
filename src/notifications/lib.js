'use strict';

const admin = require('firebase-admin');
const config = require('../config');
const gcm = require('node-gcm');

const sender = new gcm.Sender(config.getGcmApiKey());

const serviceAccount = config.getFirebaseServiceAccount();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lending.firebaseio.com"
});

// using firebase
const notify = (to, notification) => admin.messaging().sendToDevice(to, notification);

// using node-gcm
const gcmMesage = (to, notification) => {
  const message = new gcm.Message(notification);
  return new Promise((resolve, reject) => {
    sender.send(message, { registrationTokens: [to] }, (err, response) => {
      if (err) {
        return reject(err);
      }
      return resolve(response);
    });
  });
};

module.exports = {
  gcmMesage,
  notify
};
