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
  db.get().collection(table_name).find({}, {sort: [['creation_date', 'desc']]}, function(err, cursor) {
    cursor.toArray(function (error, list) {
      if (error != null) list = [];
      result(list);
    });
  });
};

exports.getCompetitionById = function(id, result) {
  db.get().collection(table_name).find({_id: ObjectId(id)}, result);
};

exports.deleteCompetitionById = function(id, result) {
  this.getCompetitionById(id, function(err, comp){
    if(comp != null) {
      //TODO: delete teams and events
      db.get().collection(table_name).deleteOne({_id: ObjectId(id)}, function(err, res) {
        if(res != null && res.result.ok == 1)
          result(true)
        else result(false);
      });
    }
    else result(false);
  });
};

exports.updateCompetitionStatus = function(id, open, result) {
  db.get().collection(table_name).update({_id: ObjectId(id)}, {$set : {open : open}}, result);
};



