/**
 * Created by Ricardo on 15/08/2016.
 */

var db = require('../db');
var ObjectId = require('mongodb').ObjectID;

var table_name = 'events';

exports.createEvent = function(competition_id, name, type, description, date_start, date_end, result) {
  var event = {
    competition_id : competition_id,
    name : name,
    type : type,
    description : description,
    date_start : date_start,
    date_end : date_end,
    classifications : []
  };

  db.get().collection(table_name).insertOne(event, function(err, res) {
    if(res != null && res.result.ok == 1) {
      result(true);
    }
    else result(false);
  });
};

exports.getEventsByCompetition = function(competition_id, result) {
  db.get().collection(table_name).find({competition_id : competition_id}, function(err, cursor) {
    cursor.toArray(function (error, list) {
      if (error != null) list = [];
      result(list);
    });
  });
};

