
var db = require('../db');
var cryptor = require('../helper/encryptor');
var ObjectId = require('mongodb').ObjectID;

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
    password : cryptor.hash(password),
    coach : false,
    glassman : false,
    active : true
  };

  db.get().collection(table_name).insertOne(new_user, result);
};

exports.getUsers = function(result) {
  db.get().collection(table_name).find({}, result);
};

exports.updateUserRole = function(id, coach, result) {
  db.get().collection(table_name).update({_id: ObjectId(id)}, {$set : {coach : coach}}, result);
};

exports.updateUserStatus = function(id, active, result) {
  db.get().collection(table_name).update({_id: ObjectId(id)}, {$set : {active : active}}, result);
};