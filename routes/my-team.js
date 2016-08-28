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
        teams.getUserMostRecentTeam(user._id, function(team) {
          var edit = false, selected_competition = null;
          if(team == null || team.team_leader_id == user._id)
            edit = true;
          if(team != null)
            selected_competition = team.competition_id;
          res.render('my-team',
            {
              competition_list : list,
              recent_team : team,
              edit : edit,
              selected_competition : selected_competition,
              user: user,
              coach: user.coach,
              glassman: user.glassman}
          );
        });
      });
    }
    else res.redirect('/login');
  });
});

router.post('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if(user != null) {
      var id = req.body.id;
      var setCoach = req.body.coach;
    }
    else res.redirect('/login');
  });
});

module.exports = router;