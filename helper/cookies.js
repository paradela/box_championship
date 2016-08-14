/**
 * Created by Ricardo on 11/08/2016.
 */

var user = require('../model/user');
var cryptor = require('./encryptor');

var auth_cookie_name = "auth";

exports.createAuthCookie = function(username, res) {
  var value = cryptor.encrypt(username);
  res.cookie(auth_cookie_name, value);
};

exports.verifyAuthCookie = function(req, next) {
  var cookie = req.cookies.auth;

  if (cookie == null) {
    next();
  }
  else {
    var user_email = cryptor.decrypt(cookie);
    user.getUserByEmail(user_email, next);
  }
};

exports.deleteCookie = function(res) {
  res.clearCookie(auth_cookie_name);
};
