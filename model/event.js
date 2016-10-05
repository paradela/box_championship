/**
 * Created by Ricardo on 15/08/2016.
 */

var db = require('../db');
var ObjectId = require('mongodb').ObjectID;

var table_name = 'events';

exports.createEvent = function(competition_id, name, description, notes, date_start, date_end, result) {
  var event = {
    competition_id : competition_id,
    name : name,
    description : description,
    notes: notes,
    date_start : date_start,
    date_end : date_end,
    classifications : [] /* {team_id : '12312eqwd23', result: '454', rx : true } */
  };

  db.get().collection(table_name).insertOne(event, function(err, res) {
    if(res != null && res.result.ok == 1) {
      result(true);
    }
    else result(false);
  });
};

exports.getEventsByCompetition = function(competition_id, result) {
  db.get().collection(table_name).find({"competition_id" : competition_id.toString()}, function(err, cursor) {
    cursor.toArray(function (error, list) {
      if (error != null) list = [];
      result(list);
    });
  });
};

exports.getEventById = function(event_id, result) {
  db.get().collection(table_name).findOne({_id : ObjectId(event_id)}, function(err, doc) {
    result(doc);
  });
};

exports.getLastestEvent = function(competition_id, result) {
  db.get().collection(table_name).findOne({"competition_id" : competition_id.toString()}, {sort: [['date_start', 'desc']]}, function(err, doc) {
    result(doc);
  });
};

exports.deleteEventById = function(event_id, result) {
  db.get().collection(table_name).deleteOne({_id : ObjectId(event_id)}, function(err, res) {
    if(res != null && res.result.ok == 1)
      result(true);
    else result(false);
  });
};

exports.addResults = function(id, results, res) {

  //results.sort(compare);

  /*for(var i = 1; i <= results.length; i++) {
    results[i-1].place = i;
  }*/

  db.get().collection(table_name).update({_id: ObjectId(id)}, {$set : {classifications : results}}, function(err, status) {
    res(err == null);
  });
};


