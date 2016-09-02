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

      teams.getUserTeams(user, function (list) {
        res.render('teams',
          {
            teams_list : list,
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

router.post('/create', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if(user != null) {
      var team_name = req.body.team_name;
      var members = req.body.name;
      var competition_id = req.body.competition;

      try {
        if(team_name == null || team_name == '') throw 'Nome de Equipa inválido.';
        if(competition_id == null || competition_id == '') throw 'Competição inválida';
        for(var i = 0; i < members.length; i++) {
          if(members[i] == null || members[i] == '') throw 'Indique os nomes dos elementos da equipa'
        }
      }
      catch(error) {
        competitions.getCompetitions(function (list) {
          res.render('newteam',
            {
              errors : [error],
              competition_list : list,
              user: user,
              coach: user.coach,
              glassman: user.glassman
            }
          );
          return;
        });
      }

      teams.getTeamByName(team_name, function (team) {
        if(team == null) {
          teams.createTeam(competition_id, team_name, user, members, function(result) {
            if(result == true) {
              res.redirect('/myteam');
            }
            else {
              competitions.getCompetitions(function (list) {
                res.render('newteam',
                  {
                    errors : ['Erro na criação da equipa.'],
                    competition_list : list,
                    user: user,
                    coach: user.coach,
                    glassman: user.glassman
                  }
                );
              });
            }
          });
        }
        else {
          competitions.getCompetitions(function (list) {
            res.render('newteam',
              {
                errors: ['Nome da equipa já está registado.'],
                competition_list: list,
                user: user,
                coach: user.coach,
                glassman: user.glassman
              }
            );
          });
        }
      });
    }
    else res.redirect('/login');
  });
});

module.exports = router;