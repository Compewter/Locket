var chai = require('chai');
var request = require('request');
var mongoose = require('mongoose');
var io = require('socket.io/node_modules/socket.io-client');

var User = require('../../server/features/users/userModel');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var IP = '127.0.0.1';
var PORT = '1337';
var socket = 'http://' + IP + ':' + PORT;


mongoose.connect('mongodb://' + IP + '/locket');

describe('server tests', function () {

  var requestWithSession = request.defaults({jar: true});

  beforeEach(function () {

  });

  it('should respond to a get request', function (done) {
    request(socket, function (error, res, body) {

      expect(error).to.be.null;
      expect(body).to.have.string('<html');

      done();
    });
  });
  
  describe('API test', function () {
    it('should allow users to signup', function (done) {
      //remove existing testUser
      User.findOneAndRemove({username: 'testUser'}, null, function (err, user) {
        var options = {
          'method': 'POST',
          'uri': socket + '/api/users/signup',
          'json': {
            username: 'testUser',
            password: 'testPass'
          }
        };
        request.post(options, function (error, res, body) {

          expect(body).to.equal('testUser');
          expect(error).to.be.null;

          done();
        });
      });

    });

    it('should allow users to login', function (done) {

      var options = {
        'method': 'POST',
        'uri': socket + '/api/users/login',
        'json': {
          username: 'testUser',
          password: 'testPass'
        }
      };
      request.post(options, function (error, res, body) {

        expect(body).to.equal('testUser');
        expect(error).to.be.null;

        done();
      });

    });

  });
  
  describe('Socket tests', function () {
    it('should allow socket connections', function (done) {
      client = io.connect(socket, {forceNew: true});

      client.on('connect', function () {
        done();
        client.disconnect();
      });

    });
    
    //it should disconnect socket on logout event
    it('should disconnect socket on logout event', function (done) {
      client = io.connect(socket, {forceNew: true});

      client.on('connect', function () {
        client.emit('logout', {});
        //give server enough time to disconnect before testing
        setTimeout(function () {
          expect(client.connected).to.be.false;
          done();
        }, 50);
      });

    });

    //it should emit to all friends when you have come online
    xit('should notify friends when you have come online', function(done){
      client = io.connect(socket, {forceNew: true});

      client.on('connect', function () {
        done();
        client.disconnect();
      });

    });

    //it should emit to all friends when you have gone offline
    xit('should notify friends when you have gone offline', function (done) {
      client = io.connect(socket, {forceNew: true});

      client.on('connect', function () {
        client.disconnect();
        done();
      });

    });

    //it should respond to 'sendMessage' emits
    xit('should respond to \'sendMessage\' emits', function (done) {
      client = io.connect(socket, {forceNew: true});

      client.on('connect', function () {
        client.emit('sendMessage', { to: 'testUser', message: 'test message' });
      });

      client.on('messageSent', function () {
        done();
        client.disconnect();
      });

    });

    //should not send messages to non-friends
    xit('should not send messages to non-friends', function (done) {
      client = io.connect(socket, {forceNew: true});

      client.on('connect', function () {
        client.emit('sendMessage', { to: 'NON*EXISTENT*USER', message: 'test message' });
      });

      client.on('messageSent', function () {
        //should respond with message failed to send message
        client.disconnect();
      });

    });

    //it should send messages to correct user
    xit('should send messages to correct user', function (done) {
      client = io.connect(socket, {forceNew: true});

      client.on('connect', function () {
        client.emit('sendMessage', { to: 'NON*EXISTENT*USER', message: 'test message' });
      });

      client.on('messageSent', function () {
        done();
        client.disconnect();
      });

    });

    //it should allow users to send friend requests
    xit('should allow users to send friend requests', function (done) {
      client = io.connect(socket, {forceNew: true});

      client.on('connect', function () {
        client.emit('addFriend', {to: 'testUser'});
      });

      //TODO should respond to user with result of the request
      done();
      client.disconnect();
    });

    //it should listen for friend requets
    xit('should listen for friend requets', function (done) {
      client = io.connect(socket, {forceNew: true});

      client.on('connect', function () {
        client.emit('addFriend', {to: 'testUser'});
      });

      client.on('friendRequest', function () {
        done();
        client.disconnect();
      });
    });

    //it should listen for 'friendRequestAccepted' emits
    xit('should emit \'friendRequestAccepted\' when friend accepts request', function (done) {
      client = io.connect(socket, {forceNew: true});

      client.on('connect', function () {
        client.emit('addFriend', {to: 'testUser'});
      });

      client.on('friendRequestAccepted', function () {
        done();
        client.disconnect();
      });

    });


  });

});
