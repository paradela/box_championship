/**
 * Created by Ricardo on 15/08/2016.
 */

var db = require('../db');
var ObjectId = require('mongodb').ObjectID;

var table_name = 'competitions';

exports.createCompetition = function(name, result) {
  var competition = {
    creation_date : new Date(),
    name : name,
    teams_ids : [],
    events_ids : [],
    open : true
  };

  db.get().collection(table_name).insertOne(competition, result);
};

exports.getCompetitions = function(result) {
  db.get().collection(table_name).find({}, {sort: [['creation_date', 'desc']]}, result);
};

exports.getCompetitionById = function(id, result) {
  db.get().collection(table_name).find({_id: ObjectId(id)}, result);
};



