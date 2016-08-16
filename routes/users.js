var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var users = require('../model/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.glassman) {
      users.getUsers(function(err, cursor) {
        cursor.toArray(function (error, list) {
          if(error != null) list = [];
          res.render('users-mng', { user_list : list, user : user, coach : user.coach, glassman : user.glassman});
        });
      });
    }
    else res.status(403).render('error', {message : 'Permission Denied', error : { status : 403, stack : []}});
  });
});

router.post('/set_coach', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.glassman) {
      var id = req.body.id;
      var setCoach = req.body.coach;
      if(setCoach != null && (setCoach == "true" || setCoach == "false")) {
        var coach = setCoach == "true";
        users.updateUserRole(id, coach, function (err, status) {
          if (err == null && status.result.n >= 1) {
            res.send(true);
          }
          else res.status(400).send({message: 'Internal Error', error: {status: 400, stack: []}})
        });
      }
      else {
        res.status(400).send({message: 'Bad input data', error: {status: 400, stack: []}})
      }
    }
    else res.status(403).send({message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.post('/set_status', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.glassman) {
      var id = req.body.id;
      var setActive = req.body.active;
      if(setActive != null && (setActive == "true" || setActive == "false")) {
        var active = setActive == "true";
        users.updateUserStatus(id , active, function (err, status) {
          if (err == null && status.result.n >= 1) {
            res.send(true);
          }
          else res.status(400).send({message: 'Internal Error', error: {status: 400, stack: []}})
        });
      }
      else {
        res.status(400).send({message: 'Bad input data', error: {status: 400, stack: []}})
      }
    }
    else res.status(403).send({message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

module.exports = router;
