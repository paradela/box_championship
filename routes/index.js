var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var users = require('../model/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    var coach = users.userHasRole(user, users.ROLES.COACH);
    var glassman = users.userHasRole(user, users.ROLES.GLASSMAN);
    res.render('index', { user : user, coach : coach, glassman : glassman});
  });
});

module.exports = router;
