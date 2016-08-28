/**
 * Created by Ricardo on 15/08/2016.
 */

var db = require('../db');
var ObjectId = require('mongodb').ObjectID;
var users = require('./user');

var table_name = 'teams';

exports.createTeam = function(competition_id, name, team_leader, result) {
  var team = {
    name : name,
    team_leader_id : team_leader._id,
    members : [team_leader._id],
    competition_id : competition_id,
    creation_date : new Date()
  };

  db.get().collection(table_name).insertOne(team, result);
};

exports.getUserMostRecentTeam = function(user_id, result) {
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
};

function getFilledUsers(team, result) {
  var new_team = {
    name : team.name,
    team_leader : null,
    members : new Array(team.length),
    competition_id : team.competition_id
  };

  users.getUsersById(team.members, function(members) {
    new_team.members = members;

    result(new_team);
  });
}