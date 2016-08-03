var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  res.render('login', {'errors': ['Nome não está bem formatado', 'Email inválido pá!'], 'email': 'abc@mail.pt'});
  //res.redirect('/users')
});

module.exports = router;
