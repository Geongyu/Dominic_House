var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');
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
app.get('/main/develope', function (req, res) {
    res.render('develope');
});
app.get('/main/study', function (req, res) {
    var sql = 'SELECT No, Title FROM board01'
    connection.query(sql, function (err, boards, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('study', {boards: boards});
    })
});

app.get('/study/add', function(req, res) {
    var sql = 'SELECT Name, Title, Content FROM board01';
    connection.query(sql, function (err, board01, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('add', {boards: board01});
    });
});
app.post('/study/add', function (req, res) {
    var Title = req.body.Title;
    var Content = req.body.Content;
    var Name = req.body.Name;
    var sql = 'INSERT INTO board01 (Title, Content, Reddate, Name) VALUES(?, ?, now(), ?)';
    connection.query(sql, [Title, Content, Name], function (err, result, fields) {
        if(err) {
            console.log(err);
            res.status(500).send('Server Error');
        } else {
            res.redirect('/main/study'+result.InsertId);
        }
    })
})

app.get('/develope/add', function(req, res) {
    var sql = 'SELECT title, content FROM board02';
    connection.query(sql, function (err, board02, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('add', {boards: board02});
    });
});
app.post('/develope/add', function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var sql = 'INSERT INTO board02 (title, content) VALUES(?, ?)';
    connection.query(sql, [title, content], function (err, result, fields) {
        if(err) {
            console.log(err);
            res.status(500).send('Server Error');
        } else {
            res.redirect('/main/develope'+result.InsertId);
        }
    })
})
module.exports = app;

app.listen(3000, function(){
    console.log('Connected 3000 port!');
});

