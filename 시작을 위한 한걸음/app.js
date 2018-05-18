var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('view engine', 'jade');
app.set('views', './views');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(bodyParser.urlencoded({ extended: false}));
// catch 404 and forward to error handler

app.get('/main', function (req, res) {
    res.render('main');
})
app.get('/main/profile', function (req, res) {
    res.render('profile');
})
app.get('/', function (req, res) {
    res.send("Return to Main Pages!")
})

module.exports = app;

app.listen(3000, function(){
    console.log('Connected 3000 port!');
});

