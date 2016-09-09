/**
 * Created by Ricardo on 15/08/2016.
 */
var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var competitions = require('../model/competition');
var teams = require('../model/team');
var events = require('../model/event');

router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      competitions.getCompetitions(function (list) {
        res.render('competitions', {competition_list: list, user: user, coach: user.coach, glassman: user.glassman});
      });
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.post('/',function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      var name = req.body.name;
      if(name != null && name != "") {
        competitions.createCompetition(name, function(err, result){
          var errors = [];
          if(err != null || result.result.ok != 1) {
            errors.push('Erro ao criar competição.')
          }
          competitions.getCompetitions(function (list) {
            res.render('competitions', {
              competition_list: list,
              errors: errors,
              user: user,
              coach: user.coach,
              glassman: user.glassman
            });
          });
        });
      }
      else {
        var errors = ['Nome da nova competição inválido...'];
        competitions.getCompetitions(function (list) {
          res.render('competitions', {
            competition_list: list,
            errors: errors,
            user: user,
            coach: user.coach,
            glassman: user.glassman
          });
        });
      }
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.get('/delete/:id', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      competitions.deleteCompetitionById(req.params.id, function(result){
        var errors = [];
        if(!result) errors.push('Erro ao eliminar competição.');
        competitions.getCompetitions(function(er, cursor){
          cursor.toArray(function(e, list){
            if (e != null) list = [];
            res.render('competitions', {
              competition_list: list,
              errors: errors,
              user: user,
              coach: user.coach,
              glassman: user.glassman
            });
          });
        });
      });
    }
  });
});

router.get('/set_status/:id/:open', function(req, res, next){
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      var id = req.params.id;
      var setOpen = req.params.open;
      if (setOpen != null && (setOpen == "true" || setOpen == "false")) {
        var open = setOpen == "true";
        competitions.updateCompetitionStatus(id, open, function (err, result) {
          res.redirect('/competitions');
        });
      }
      else res.status(400).render('error', {message: 'Bad input data', error: {status: 400, stack: []}})
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.get('/:competition_id/teams', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      var competition_id = req.params.competition_id;
      teams.getTeamsByCompetition(competition_id, function(list) {
        competitions.getCompetitionById(competition_id, function(error, comp) {
          if(error == null){
            res.render('competition_teams', {
              competition : comp,
              team_list : list,
              user: user,
              coach: user.coach,
              glassman: user.glassman});
          }
          else res.status(400).render('error', {message: 'Invalid competition', error: {status: 400, stack: []}})
        });
      });
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.post('/team/:team_id/:status', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      //todo
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.get('/:competition_id/events', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      var competition_id = req.params.competition_id;
      events.getEventsByCompetition(competition_id, function(list) {
        competitions.getCompetitionById(competition_id, function(error, comp) {
          if(error == null){
            res.render('competition_events', {
              competition : comp,
              event_list : list,
              user: user,
              coach: user.coach,
              glassman: user.glassman});
          }
          else res.status(400).render('error', {message: 'Invalid competition', error: {status: 400, stack: []}})
        });
      });
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.post('/:competition_id/event', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      //todo
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.get('/delete/event/:event_id', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      //todo
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

module.exports = router;
