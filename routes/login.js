var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');
var users = require('../model/user');

router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if(user == null) {
      res.render('login');
    }
    else res.redirect('/');
  });
});

router.post('/', function(req, res, next) {
  users.authenticate(req.body.email, req.body.password, function(err, user){
    if(user != null) {
      cookie.createAuthCookie(user.email, res);
      res.redirect('/');
    }
    else {
      res.render('login', {'errors': ['Email ou password inválidos.'], 'email': req.body.email});
    }
  });
});

module.exports = router;
