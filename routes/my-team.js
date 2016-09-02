/**
 * Created by Ricardo on 23/08/2016.
 */
var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var competitions = require('../model/competition');
var teams = require('../model/team');

router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function (err, user) {
    if(user != null) {

      competitions.getCompetitions(function (list) {
        res.render('teams',
          {
            competition_list : list,
            user: user,
            coach: user.coach,
            glassman: user.glassman
          }
        );
      });
    }
    else res.redirect('/login');
  });
});

router.get('/create', function(req, res, next) {
  cookie.verifyAuthCookie(req, function (err, user) {
    if(user != null) {
      competitions.getCompetitions(function (list) {
        res.render('newteam',
          {
            competition_list : list,
            user: user,
            coach: user.coach,
            glassman: user.glassman
          }
        );
      });
    }
    else res.redirect('/login');
  });
});

router.post('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if(user != null) {
      var team_name = req.body.team_name;
      var user_emails = req.body.user_email;
      
    }
    else res.redirect('/login');
  });
});

module.exports = router;