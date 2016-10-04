/**
 * Created by Ricardo on 15/08/2016.
 */
var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var competitions = require('../model/competition');
var teams = require('../model/team');
var events = require('../model/event');
var async = require('async');

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

router.get('/team/:team_id/change_status', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      var team_id = req.params.team_id;
      teams.getTeamById(team_id, function(team) {
        if(team != null) {
          teams.setTeamStatus(team_id, !team.approved, function(ok) {
            res.redirect('/competitions/' + team.competition_id + '/teams');
          });
        }
        else res.status(403).render('error', {message: 'Team not found', error: {status: 404, stack: []}});
      });
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

function renderCompetitionEvents(competition_id, res, name, description, notes, exception, user) {
  events.getEventsByCompetition(competition_id, function (list) {
    competitions.getCompetitionById(competition_id, function (error, comp) {
      if (error == null) {
        res.render('competition_events', {
          fields: {
            name: name,
            description: description,
            notes: notes
          },
          errors: [exception],
          competition: comp,
          event_list: list,
          user: user,
          coach: user.coach,
          glassman: user.glassman
        });
      }
      else res.status(400).render('error', {message: 'Invalid competition', error: {status: 400, stack: []}})
    });
  });
}

router.post('/:competition_id/event', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      var competition_id = req.params.competition_id;
      var name = req.body.name;
      var date_begin = req.body.date_start;
      var date_end = req.body.date_end;
      var description = req.body.description;
      var notes = req.body.notes;
      var ts_date_start;
      var ts_date_end;

      try {
        if(name == null || name == '') throw 'O nome do evento tem de estar preenchido.';
        if(date_begin == null || date_begin == '') throw 'A data de início tem de estar preenchida.';
        ts_date_start = Date.parse(date_begin);
        if(date_end == null || date_end == '') throw 'Data de fim tem de estar preenchida.';
        ts_date_end = Date.parse(date_end);
        if(ts_date_start > ts_date_end) throw 'A data de fim não pode ser anterior à data de início.';
        if(description == null || description == '') throw 'Tem de ser dada uma descrição do evento.';

      }
      catch (exception) {
        renderCompetitionEvents(competition_id, res, name, description, notes, exception, user);
        return;
      }

      var begin = new Date(ts_date_start);
      var end = new Date(ts_date_end);

      events.createEvent(competition_id, name, description, notes, begin, end, function(ok) {
        if(ok) res.redirect('/competitions/' + competition_id + '/events');
        else {
          renderCompetitionEvents(competition_id, res, name, description, notes, 'Falha na criação do evento...', user);
        }
      });
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.get('/:competition_id/:event_id/delete', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      var event_id = req.params.event_id;
      var competition_id = req.params.competition_id;
      events.deleteEventById(event_id, function(ok){
        if(ok) res.redirect('/competitions/' + competition_id + '/events');
        else {
          events.getEventsByCompetition(competition_id, function(list) {
            competitions.getCompetitionById(competition_id, function(error, comp) {
              if(error == null){
                res.render('competition_events', {
                  errors: ['Failed to delete event.'],
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
      });
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

/*router.get('/results/:competition_id?', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      var competition_id = req.params.competition_id;
      var redirectForComp = function(comp) {
        if(comp != null)
          events.getLastestEvent(comp._id, function(event) {
            var url = '/competitions/' + comp._id + '/results/';
            if(event != null)
              url += event._id;
            res.redirect(url);
          });
        else res.redirect('/competitions/results');
      };

      if(competition_id == null)
        competitions.getLatestCompetition(function(comp) {
          redirectForComp(comp);
        });
      else competitions.getCompetitionById(competition_id, function(err, comp) {
        redirectForComp(comp);
      });
    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});*/

router.get('/:competition_id/results/:event_id?', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      var competition_id = req.params.competition_id;
      var event_id = req.params.event_id;

      async.parallel([
        function (callback) {
          competitions.getCompetitionById(competition_id, function(err, comp) {
            var obj = {type : 0, result : comp};
            callback(null, obj);
          });
        },
        function(callback) {
          events.getEventById(event_id, function(event) {
            var obj = {type : 3, result : event};
            callback(null, obj);
          });
        },
        function(callback) {
          teams.getTeamsByCompetition(competition_id, function(teams_list) {
            var obj = {type : 4, result : teams_list};
            callback(null, obj);
          })
        }
      ], function(err, results) {
        var comp, evnt, team_list;
        var evntResByTeam = new Map();

        for(var i = 0; i < results.length; i++) {
          var reslt = results[i];
          switch (reslt.type) {
            case 0: comp = reslt.result; break;
            case 3: evnt = reslt.result; break;
            case 4: team_list = reslt.result; break;
          }
        }

        for(i = 0; evnt != null && i < evnt.classifications.length; i++) {
          var result = evnt.classifications[i];
          evntResByTeam.set(result.team_id, result);
        }

        for(i = 0; i < team_list; i++) {
          var team = team_list[i];
          result = evntResByTeam[team._id.toString()];
          team.result = result;
        }

        res.render('results', {
          competition : comp,
          event : evnt,
          teams : team_list,
          user: user,
          coach: user.coach,
          glassman: user.glassman
        });

      });

    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

router.post('/results/:event_id', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if (user != null && user.coach) {
      var event_id = req.params.event_id;
      var team_ids = req.body.id;
      var results = req.body.result;
      var tiebreaks = req.body.tiebreak;
      var mode = req.body.mode;

      var classifications = [];
      //{place : '1', team_id : '12312eqwd23', result: '454', rx : true }
      for(var i = 0; i < team_ids.length; i++) {
        classifications[i] = {team_id : team_ids[i], result : results[i], tiebreak : tiebreaks[i], rx : mode[i] == 'RX'};
      }

      events.addResults(event_id, classifications, function(ret) {
        res.status(200).send();
      })

    }
    else res.status(403).render('error', {message: 'Permission Denied', error: {status: 403, stack: []}});
  });
});

module.exports = router;
