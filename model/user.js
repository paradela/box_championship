
var db = require('../db');

var table_name = 'users';
var field_email = 'email';
var field_name = 'name';
var field_password = 'password';

exports.authenticate = function(email, password, done) {

};

exports.getUserByEmail = function(email, result) {
  db.get().collection(table_name).findOne({field_email : email}, result);
};

exports.insertUser = function(name, email, password, result) {
  var new_user = {
    field_name : name,
    field_email : email,
    field_password : password
  };

  db.get().collection(table_name).insertOne(new_user, result);
};