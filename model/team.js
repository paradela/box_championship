/**
 * Created by Ricardo on 15/08/2016.
 */

var db = require('../db');
var ObjectId = require('mongodb').ObjectID;
var users = require('./user');
var competitions = require('./competition');

var table_name = 'teams';

exports.createTeam = function(competition_id, name, team_leader, member_names, result) {
  var team = {
    name : name,
    team_leader_id : team_leader._id,
    members : [],
    competition_id : competition_id,
    creation_date : new Date()
  };

  team.members = member_names;

  db.get().collection(table_name).insertOne(team, function(err, res) {
    if(res != null && res.result.ok == 1) {
      result(true);
    }
    else result(false);
  });
};

/*exports.getUserMostRecentTeam = function(user_id, result) {
  db.get().collection(table_name).findOne({members : user_id}, {sort: [['creation_date', 'desc']]}, function(err, doc) {
    var team = null;
    if(doc != null) {
      getFilledUsers(doc, function(new_team){
        team = new_team;
        result(team);
      });
    }
    else result(team);
  });
};*/

exports.getTeamByName = function(team_name, result) {
  db.get().collection(table_name).findOne({name : team_name}, function(err, doc) {
    result(doc);
  });
};

/*function getFilledUsers(team, result) {
  var new_team = {
    name : team.name,
    team_leader : null,
    members : new Array(team.length),
    competition : team.competition
  };

  users.getUsersById(team.members, function(members) {
    new_team.members = members;

    result(new_team);
  });
}*/

exports.getUserTeams = function(user, result) {
  db.get().collection(table_name).find({team_leader_id : user._id}, {sort: [['creation_date', 'desc']]}, function(err, cursor) {
    cursor.toArray(function (error, list) {
      if (error != null) list = [];

      var competition_ids = [];
      for(var i = 0; i < list.length; i++) {
        competition_ids.push(list[i].competition_id);
      }
      competitions.getCompetitionByIds(competition_ids, function(comps) {
        var comparr = [];
        for(var l = 0; l < comps.length; l++) {
          var cid = comps[l]._id.toString();
          comparr[l] = cid;
        }

        for(var j = 0; j < list.length; j++) {
          var idx = comparr.indexOf(list[j].competition_id.toString());
          list[j].competition = comps[idx];
        }

        result(list);
      });
    });
  });
};

exports.getTeamsByCompetition = function(competition_id, result) {
  db.get().collection(table_name).find({competition_id : competition_id}, function(err, cursor) {
    cursor.toArray(function (error, list) {
      if (error != null) list = [];
      result(list);
    });
  });
};

exports.deleteTeam = function(teamid, result) {
  db.get().collection(table_name).deleteOne({_id: ObjectId(teamid)}, function(err, res) {
    if(res != null && res.result.ok == 1)
      result(true);
    else result(false);
  });
};
