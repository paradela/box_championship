var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');

router.get('/', function(req, res, next) {
  cookie.deleteCookie(res);
  res.redirect('/');
});

module.exports = router;