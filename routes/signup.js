/**
 * Created by Ricardo on 02/08/2016.
 */
var express = require('express');
var router = express.Router();

var user = require('../model/user');

router.post('/', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var password_conf = req.body.confirm_password;

  user.getUserByEmail(email, function(err, document) {
    if(document == null) {

      if(password != password_conf) {
        /*log error*/

        return;
      }
      else {
        user.insertUser(name, email, password, function(err, result) {
          if(result != null && result.result.ok == 1) {
            res.redirect('/users')
          }
          else {
            /*log error*/
          }
        });
      }
    }
    else {
      /*log error*/
    }

  });


});

module.exports = router;