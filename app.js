var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = require('./db');

var users = require('./routes/users');
var login = require('./routes/login');
var signup = require('./routes/signup');
var logout = require('./routes/logout');
var index = require('./routes/index');
var competitions = require('./routes/competitions');
var myteam = require('./routes/my-team');
var events = require('./routes/events');
var classification = require('./routes/classification');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login', login);
app.use('/signup', signup);
app.use('/users', users);
app.use('/logout', logout);
app.use('/competitions', competitions);
app.use('/myteam', myteam);
app.use('/events', events);
app.use('/classification', classification);

var dburl = process.env.MONGODB_URL;

if(dburl == null)
  dburl = 'mongodb://localhost:27017/bctest';

// Connect to Mongo on start
db.connect(dburl, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
