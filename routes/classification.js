/**
 * Created by Ricardo on 11/09/2016.
 */

var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var users = require('../model/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    var coach = (user != null)? user.coach : null;
    var glassman = (user != null)? user.glassman : null;
    res.render('classification', { user : user, coach : coach, glassman : glassman});
  });
});


module.exports = router;