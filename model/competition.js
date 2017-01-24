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

exports.getLatestCompetition = function(result) {
  db.get().collection(table_name).findOne({}, {sort: [['creation_date', 'desc']]}, function(error, doc) {
    result(doc);
  });
};

exports.getCompetitions = function(result) {
  db.get().collection(table_name).find({}, {sort: [['creation_date', 'desc']]}, function(err, cursor) {
    cursor.toArray(function (error, list) {
      if (error != null) list = [];
      result(list);
    });
  });
};

exports.getOpenCompetitions = function(result) {
  db.get().collection(table_name).find({open : true}, {sort: [['creation_date', 'desc']]}, function(err, cursor) {
    cursor.toArray(function (error, list) {
      if (error != null) list = [];
      result(list);
    });
  });
};

exports.getCompetitionById = function(id, result) {
  db.get().collection(table_name).findOne({_id: ObjectId(id)}, result);
};

exports.getCompetitionByIds = function(ids, result) {
  var select = {
    $or : []
  };

  for(var i = 0; i < ids.length; i++) {
    select.$or.push({_id : ObjectId(ids[i])});
  }

  db.get().collection(table_name).find(select, function (res, cursor) {
    cursor.toArray(function (error, list) {
      if (error != null) list = [];
      result(list);
    });
  });
};

exports.deleteCompetitionById = function(id, result) {
  this.getCompetitionById(id, function(err, comp){
    if(comp != null) {
      //TODO: delete teams and events
      db.get().collection(table_name).deleteOne({_id: ObjectId(id)}, function(err, res) {
        if(res != null && res.result.ok == 1)
          result(true);
        else result(false);
      });
    }
    else result(false);
  });
};

exports.updateCompetitionStatus = function(id, open, result) {
  db.get().collection(table_name).update({_id: ObjectId(id)}, {$set : {open : open}}, result);
};



