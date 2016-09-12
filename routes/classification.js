/**
 * Created by Ricardo on 11/09/2016.
 */

var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var users = require('../model/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    var coach = (user != null)? user.coach : null;
    var glassman = (user != null)? user.glassman : null;

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




    res.render('classification', { user : user, coach : coach, glassman : glassman});
  });
});


module.exports = router;