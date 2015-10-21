var chai = require('chai');
var request = require('request');
var mongoose = require('mongoose');
var io = require('socket.io/node_modules/socket.io-client');

var User = require('../../server/features/users/userModel');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var IP = '127.0.0.1';
var PORT = '1337'
var socket = 'http://'+IP+':'+PORT;


mongoose.connect('mongodb://' + IP + '/locket');

describe('server tests', function(){

  var requestWithSession = request.defaults({jar: true});

  beforeEach(function() {

  });

  it('should respond to a get request', function(done){
    request(socket, function(error, res, body) {

      expect(error).to.be.null;
      expect(body).to.have.string('<html');

      done();
    });
  });
  
  describe('API test', function(){
    it('should allow users to signup', function(done){
      //remove existing testUser
      User.findOneAndRemove({username:'testUser'}, null, function(err, user){
        var options = {
          'method': 'POST',
          'uri': socket + '/api/users/signup',
          'json': {
            username: 'testUser', 
            password: 'testPass'
          }
        };
        request.post(options, function(error, res, body) {

          expect(body).to.equal('testUser');
          expect(error).to.be.null;

          done();
        });
      });

    });

    it('should allow users to login', function(done){

      var options = {
        'method': 'POST',
        'uri': socket + '/api/users/login',
        'json': {
          username: 'testUser', 
          password: 'testPass'
        }
      };
      request.post(options, function(error, res, body) {

        expect(body).to.equal('testUser');
        expect(error).to.be.null;

        done();
      });

    });

  });
  
  describe('Socket tests', function(){
    it('should allow socket connections', function(done){
      client = io.connect(socket);
      
      client.on('connect', function(){
        done();
      });

    });
  });

});
