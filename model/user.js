
var db = require('../db');
var cryptor = require('../helper/encryptor');

var table_name = 'users';

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
    password : cryptor.hash(password)
  };

  db.get().collection(table_name).insertOne(new_user, result);
};