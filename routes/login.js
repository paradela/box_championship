var express = require('express');
var router = express.Router();

var cookie = require('../helper/cookies');

/* GET users listing. */
router.get('/', function(req, res, next) {
  cookie.createAuthCookie('username', res);
  res.render('login');
});

router.post('/', function(req, res, next) {
  var c = req.cookies;
  res.render('login', {'errors': ['Nome não está bem formatado', 'Email inválido pá!'], 'email': 'abc@mail.pt'});
  //res.redirect('/users')
});

module.exports = router;
