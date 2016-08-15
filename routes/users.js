var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var users = require('../model/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    var coach = users.userHasRole(user, users.ROLES.COACH);
    var glassman = users.userHasRole(user, users.ROLES.GLASSMAN);
    if(glassman) {
      users.getUsersWithRole(users.ROLES.ATHLETE, function(err, cursor) {
        cursor.toArray(function (error, list) {
          if(error != null) list = [];
          res.render('users-mng', { user_list : list, user : user, coach : coach, glassman : glassman});
        });
      });
    }
    else res.status(403).render('error', {message : 'Permission Denied', error : { status : 403, stack : []}});
  });
});

module.exports = router;
