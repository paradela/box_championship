
var db = require('../db');
var cryptor = require('../helper/encryptor');

var table_name = 'users';

var ROLES = {ATHLETE : 1, COACH : 2, GLASSMAN : 3};

exports.ROLES = ROLES;

exports.authenticate = function(email, password, done) {
  var hashed_pwd = cryptor.hash(password);
  db.get().collection(table_name).findOne({email : email, password : hashed_pwd}, done);
};

exports.getUserByEmail = function(email, result) {
  db.get().collection(table_name).findOne({email : email}, result);
};

exports.insertUser = function(name, email, password, result) {
  var new_user = {
    name : name,
    email : email,
    password : cryptor.hash(password),
    roles : [ROLES.ATHLETE]
  };

  db.get().collection(table_name).insertOne(new_user, result);
};

exports.userHasRole = function(user, role) {
  if(user != null && role != null) {
    var len = user.roles.length;
    for(var i = 0; i < len; i++) {
      var r = user.roles[i];
      if(r == role) return true;
    }
  }
  return false;
};