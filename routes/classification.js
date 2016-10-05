/**
 * Created by Ricardo on 11/09/2016.
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var cookie = require('../helper/cookies');
var competitions = require('../model/competition');
var teams = require('../model/team');
var events = require('../model/event');

//var classi = {
//  events : ['Evento 1', 'Evento 2'],
//  team_results : [
//    {
//      team_name : 'Equipa Fixe 1',
//      place : '1',
//      points : '2',
//      team_events : [
//        {
//          place : '1',
//          result : '512'
//        },
//        {
//          place : '1',
//          result : '15:25'
//        }
//      ]
//    },
//    {
//      team_name : 'Equipa Fixe 2',
//      place : '2',
//      points : '4',
//      team_events : [
//        {
//          place : '2',
//          result : '300'
//        },
//        {
//          place : '2',
//          result : '45:25'
//        }
//      ]
//    }
//  ]
//};

/* GET home page. */
router.get('/:competition_id?', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    var coach = (user != null)? user.coach : null;
    var glassman = (user != null)? user.glassman : null;
    var competition_id = req.params.competition_id;


    async.waterfall([
      function (callback) {
        var obj = {
          competition : null,
          competitions : null,
          events : null,
          teams : null
        };

        if(competition_id != null)
          competitions.getCompetitionById(competition_id, function(err, comp) {
            obj.competition = comp;
            callback(null, obj);
          });
        else competitions.getLatestCompetition(function(comp) {
          obj.competition = comp;
          callback(null, obj);
        })
      },
      function(arg, callback) {
        competitions.getCompetitions(function(comp_list) {
          arg.competitions = comp_list;
          callback(null, arg);
        });
      },
      function(arg, callback) {
        if(arg.competition != null)
          events.getEventsByCompetition(arg.competition._id, function(events) {
            arg.events = events;
            callback(null, arg);
          });
        else callback(null, arg);
      },
      function(arg, callback) {
        if(arg.competition != null)
          teams.getTeamsByCompetition(arg.competition._id, function(teams_list) {
            arg.teams = teams_list;
            callback(null, arg);
          });
        else callback(null, arg);
      }
    ], function(err, result) {

      var teamMap = {};
      var teamArr = [];

      if(result.teams != null)
        for(var team of result.teams) {
          team.team_events = [];
          teamMap[team._id.toString()] = team;
        }

      classifyEvents(result.events);

      if(result.events != null)
        for(var event of result.events) {
          if(event.classifications) {
            for(var r of event.classifications) {
              team = teamMap[r.team_id];
              team.team_events.push(r);
            }
          }
        }

      for(var t in teamMap) {
        var tr = teamMap[t];
        var total = 0;
        if(tr.team_events != null) {
          for(var e of tr.team_events) {
            total += e.place;
          }
        }
        tr.points = total;
        teamArr.push(tr);
      }

      classifyTeams(teamArr);

      var classi = newClassification(result.events, teamArr);

      res.render('classification', {
        user : user,
        coach : coach,
        glassman : glassman,
        classifications : classi,
        current_competition : result.competition,
        competitions: result.competitions});

    });

  });
});

function newClassification(events, teams) {
  var c = {
    events : [],
    team_results : []
  };

  if(events != null) {
    for(var e of events) {
      c.events.push(e.name);
    }
  }

  if(teams != null) {
    for(var t of teams) {
      c.team_results.push(t);
    }
  }

  return c;
}

function classifyTeams(teams) {
  teams.sort(function(a, b) {
    return a.points - b.points;
  });

  var prev = 0, place = 0;

  for(var i = 0; i < teams.length; i++) {
    var cur = teams[i];

    if(cur.points > prev) {
      place++;
    }
    cur.place = place;

    prev = cur.points;
  }
}

function classifyEvents(events) {
  if(events != null || events.length > 0) {
    for(var event of events) {
      if(event.classifications != null)
        classifyEvent(event.classifications);
    }
  }
}

function classifyEvent(results) {
  results.sort(compare);

  var prev = null, place = 0;

  for(var i = 0; i < results.length; i++) {
    var cur = results[i];

    if(!equalResults(cur, prev)) {
      place++;
    }
    cur.place = place;

    prev = cur;
  }

}


function equalResults(res1, res2) {
  if(res1 == null && res2 != null || res2 == null && res1 != null)
    return false;

  var a = (res1.result == res2.result);
  var b = (res1.tiebreak == res2.tiebreak);
  var c = (res1.rx == res2.rx);
  //var d = (res1.participation == res2.participation);

  return a && b && c /*&& d*/;
}

function compare(a, b) {
  var rIsTime = a.result.indexOf(':') > -1 || b.result.indexOf(':') > -1;
  var tbIsTime = a.tiebreak.indexOf(':') > -1 || b.tiebreak.indexOf(':') > -1;
  var ar = parseInt(a.result.replace(/:/g, ''));
  var br = parseInt(b.result.replace(/:/g, ''));
  var atb = parseInt(a.tiebreak.replace(/:/g, ''));
  var btb = parseInt(b.tiebreak.replace(/:/g, ''));
  var a0 = (a.rx)? 1 : 0;
  var b0 = (b.rx)? 1 : 0;
  var parA = a.participation;
  var parB = b.participation;

  //if both teams have the same number of participants, continue
  var res = parB - parA;
  if(res != 0) return res;

  //if both results are rx or scaled continue
  res = b0 - a0;
  if(res != 0) return res;

  if(rIsTime) {
    //if result is time, a smaller time is first
    res = ar - br;
    if(res != 0) return res;
  }
  else {
    //if result is reps, more reps is first
    res = br - ar;
    if(res != 0) return res;
  }

  if(tbIsTime) {
    //if tie break is time, a smaller time is first
    res = atb - btb;
    if(res != 0) return res;
  }
  else {
    res = btb - atb;
    //if tie break is reps, more reps is first
    if(res != 0) return res;
  }

  return 0;
}


module.exports = router;