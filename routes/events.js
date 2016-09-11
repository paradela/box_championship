/**
 * Created by Ricardo on 11/09/2016.
 */
var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var users = require('../model/user');
var events = require('../model/event');
var competitions = require('../model/competition');

/* GET home page. */
router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    var coach = (user != null)? user.coach : null;
    var glassman = (user != null)? user.glassman : null;
    competitions.getLatestCompetition(function(comp) {
      if(comp != null)
        events.getLastestEvent(comp._id, function(event) {
          if(event != null)
            res.redirect('/events/' + event._id);
          else res.render('events', { user : user, coach : coach, glassman : glassman});
        });
      else res.render('events', { user : user, coach : coach, glassman : glassman});
    });
  });
});

router.get('/:event_id', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    var coach = (user != null)? user.coach : null;
    var glassman = (user != null)? user.glassman : null;
    var event_id = req.params.event_id;
    events.getEventById(event_id, function(event) {
      competitions.getLatestCompetition(function(comp) {
        if(comp == null) {
          res.render('events', { user : user, coach : coach, glassman : glassman});
        }
        else events.getEventsByCompetition(comp._id, function(events_list) {
          res.render('events', {events: events_list, event: event, user : user, coach : coach, glassman : glassman});
        });
      });
    });
  });
});

module.exports = router;