'use strict';

const config = require('./config');
const env = process.env.NODE_ENV || 'development';
const envtConfig = config[env]; // env specific values
const firebaseServiceAccount = require('./firebase-admin');

module.exports = {
  getAdminEmail : () => {
    return process.env.ADMIN_EMAIL || envtConfig.adminEmail;
  },
  getAdminEmailPassword : () => {
    return process.env.ADMIN_EMAIL_PASSWORD || envtConfig.adminEmailPassword;
  },

  getAdminGethAccount: () => envtConfig.adminGethAccount,

  getEnv: () => env,

  getDbConnectionString: () => {
    return process.env.DB_URL || envtConfig.dbString;
  },
  getFcmServerKey: () => {
    return process.env.FCM_SERVER_KEY || envtConfig.fcmServerKey;
  },
  getGcmApiKey: () => {
    return process.env.GCM_API_KEY || envtConfig.gcmApiKey;
  },
  getGethUrl: () => {
    return process.env.GETH_URL || envtConfig.gethUrl;
  },

  getFirebaseServiceAccount: () => firebaseServiceAccount,

  getStatusMsgs: () => config.statusMsgs,

  getURL: () => envtConfig.url
};
