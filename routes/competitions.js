/**
 * Created by Ricardo on 15/08/2016.
 */
var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var competitions = require('../model/competition');

router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user.coach) {
      competitions.getCompetitions(function (err, cursor) {
        cursor.toArray(function (error, list) {
          if (error != null) list = [];
          res.render('competitions', {competition_list: list, user: user, coach: user.coach, glassman: user.glassman});
        });
      });
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.post('/',function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user.coach) {
      var name = req.body.name;
      if(name != null && name != "") {
        competitions.createCompetition(name, function(err, result){
          var errors = [];
          if(err != null || result.result.ok != 1) {
            errors.push('Erro ao criar competição.')
          }
          competitions.getCompetitions(function (err, cursor) {
            cursor.toArray(function (error, list) {
              if (error != null) list = [];
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
      else {
        var errors = ['Nome da nova competição inválido...'];
        competitions.getCompetitions(function (err, cursor) {
          cursor.toArray(function (error, list) {
            if (error != null) list = [];
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
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

module.exports = router;
