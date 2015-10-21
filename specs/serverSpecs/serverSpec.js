var chai = require('chai');
var request = require('request');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/locket');
var User = require('../../server/features/users/userModel');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var IP = 'http://127.0.0.1:1337';

describe('server tests', function(){

  var requestWithSession = request.defaults({jar: true});

  beforeEach(function() {

  });

  it('should respond to a get request', function(done){
    request(IP, function(error, res, body) {

      expect(error).to.be.null;
      expect(body).to.have.string('<html');

      done();
    });
  });
  
  describe('API test', function(){
    it('should allow users to signup', function(done){
      //remove existing testUser
      User.findOneAndRemove({username:"testUser"}, null, function(err, user){
        var options = {
          'method': 'POST',
          'uri': IP + '/api/users/signup',
          'json': {
            username: "testUser", 
            password: "testPass"
          }
        };
        request.post(options, function(error, res, body) {

          console.log(body);
          expect(error).to.be.null;

          done();
        });
      });
      
    });

  });
  
});
