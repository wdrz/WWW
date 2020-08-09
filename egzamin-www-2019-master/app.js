var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('baza.db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.locals.db = db;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const secretkey = "Jakis sekret";

app.use(cookieParser(secretkey));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: secretkey,
  cookie: { maxAge: 15 * 60 * 1000 } // session length: 15 min
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
