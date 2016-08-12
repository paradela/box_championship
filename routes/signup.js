/**
 * Created by Ricardo on 02/08/2016.
 */
var express = require('express');
var router = express.Router();

var user = require('../model/user');
var cookie = require('../helper/cookies');

router.get('/', function(req, res, next) {
  cookie.verifyAuthCookie(req, function(err, user) {
    if(user == null) {
      res.render('signup');
    }
    else res.redirect('/users');
  });
});

router.post('/', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var password_conf = req.body.confirm_password;

  var status = {
    'errors' : new Array(),
    'email' : '',
    'name' : ''
  };

  if (!validateEmail(email)) {
    status.errors.push('Email mal formado. Ex: utilizador@mail.com');
    status.name = name;
    status.email = email;
    res.render('signup', status);
  }
  else
    user.getUserByEmail(email, function (err, document) {
      try {
        if (document == null) {

          if (!validateName(name))
            throw 'Nome deve conter pelo menos três letras. Não usar outros caracteres.';

          if (!validatePassword(password, password_conf))
            throw 'Password mal formada. Deve conter maiúsculas, minúsculas e números. Mínimo de 6 caracteres.';

          if (password != password_conf)
            throw 'Passwords devem ser iguais.';
          else {
            user.insertUser(name, email, password, function (err, result) {
              if (result != null && result.result.ok == 1) {
                cookie.createAuthCookie(email, res);
                res.redirect('/users');
              }
              else throw 'Erro ao criar o utilizador, por favor tente mais tarde.';
            });
          }
        }
        else throw 'Email introduzido já se encontra em uso.';
      }
      catch (err) {
        status.errors.push(err);
        status.name = name;
        status.email = email;
        res.render('signup', status);
      }
    });
});

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateName(name) {
  //TODO
  return true;
}

function validatePassword(password, password_confirm) {
  //TODO
  return true;
}

module.exports = router;