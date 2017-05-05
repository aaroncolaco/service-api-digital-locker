'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./controller');

// middleware to allow CORS
router.use(function(req, res, next) {
  var origin = req.headers.origin;

  res.setHeader('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

router.post('/', controller.addUser);
router.post('/update', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;
