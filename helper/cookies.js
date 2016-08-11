/**
 * Created by Ricardo on 11/08/2016.
 */

var user = require('../model/user');
var cryptor = require('./encryptor');

var key = 'abcdefghijklmnopqrstuvxz123456789';
var auth_cookie_name = "auth";

exports.createAuthCookie = function(username, res) {
  var value = {
    user : cryptor.encrypt(username),
    expire : new Date() + (30 * 24 * 60 * 60 * 1000)
  };
  res.cookie(auth_cookie_name, value);
};

exports.verifyAuthCookie = function(req, next) {
  var cookie = req.cookies;
  //todo validate expiration date

  var user_email = cryptor.decrypt(cookie.user);
  user.getUserByEmail(user_email, next);
};
