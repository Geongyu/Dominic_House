var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'board'
});

connection.connect();

// mysql 연동을 위한

// view engine setup
app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false}));
// catch 404 and forward to error handler

app.get('/main', function (req, res) {
    res.render('main');
});
app.get('/main/profile', function (req, res) {
    res.render('profile');
});
app.get('/', function (req, res) {
    res.render('main');
});
app.get('/main/deveolpe', function (req, res) {
    res.render('develope');
});
app.get('/main/study', function (req, res) {
    res.render('study');
});

module.exports = app;

app.listen(3000, function(){
    console.log('Connected 3000 port!');
});

