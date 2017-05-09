'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const bin = require('../bin/www');
const config = require('../config');

const hostURL = config.getURL();
const apiRootURL = '/api/users/';
const usersUrl = hostURL + apiRootURL;
let deleteUrl = usersUrl;


const user = {
  "ethAccount": "0x1ec242f959295b04c33bd277ba286c8383b164d8",
  "firebaseToken": "fwuRJg74v7g:APA91bE3GMYUhvRNKZHQCXs4s8NfbmX246e4GOeRS7sk1u2ZGB7NZ89FcffZLfQwo6tpk6_d-mVdemNealVxFc1lxm3bAtqfvt-b4Oe7uLKgdToz5tzIeOD_WSfnblNu4iRcNnMllxKZ",
};

const fakeUser = {
  "ethAccount": "0x54ab617553e808286647io83e92203bc7e9afaa9",
  "firebaseToken": "fwuRJg74v7g:APA91bE3GMdsfsdf2ZGB7NZ89FcffZLfQwo6tpk6_d-mVdemNealVxFc1lxm3bAtqfvt-b4Oe7uLKgdToz5tzIeOD_WSfnblNu4iRcNnMllxKZ",
};

const updatedUser = {
  "ethAccount": "0x1ec242f959295b04c33bd277ba286c8383b164d8",
  "firebaseToken": "fwuRJg74v7g:APA91bE3GMdsfsdf2ZGB7NZ89FcffZLfQwo6tpk6_d-mVdemNealVxFc1lxm3bAtqfvt-b4Oe7uLKgdToz5tzIeOD_WSfnblNu4iRcNnMllxKZ",
};


describe('User Tests', () => {

  describe('POST /users', () => {
    it('add user', (done) => {
      chai.request(usersUrl)
        .post('')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.an('object');

          expect(res.body.ethAccount).to.equal(user.ethAccount);
          expect(res.body.firebaseToken).to.equal(user.firebaseToken);

          deleteUrl += res.body._id;

          done();
        });
    });
  });

  describe('POST /users/:id', () => {
    it('update user token', (done) => {
      chai.request(usersUrl + 'update')
        .post('/')
        .send(updatedUser)
        .end((err, res) => {
          expect(res).to.have.status(202);
          expect(res).to.be.an('object');
          done();
        });
    });
    it('fake user returns 404', (done) => {
      chai.request(usersUrl + 'update')
        .post('/')
        .send(fakeUser)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res).to.be.an('object');
          done();
        });
    });
  });

  describe('DELETE /users/:id', () => {
    it('delete user', (done) => {
      chai.request(deleteUrl)
        .delete('')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');

          expect(res.body.ethAccount).to.equal(user.ethAccount);
          expect(res.body.firebaseToken).to.equal(updatedUser.firebaseToken);

          done();
        });
    });
  });

});
