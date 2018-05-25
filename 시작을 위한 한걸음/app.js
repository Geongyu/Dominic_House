var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');
var app = express();
var session = require('express-session');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'board'
});
connection.connect();
// mysql 연동을 위한

var passport = require('passport');
// require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
//로그인 세션 유지


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
// 익스프레스 세션 암호화

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
    var sql = 'SELECT * FROM board02';
    connection.query(sql, function (err, boards, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('서버 오류');
        }
            res.render('develope', {boards: boards});
         })
});
/*
app.get('/study/:No'), function(req, res) {
    console.log('여기까지옴');
    var sql = 'SELECT * FROM board01';
    connection.query(sql, function (err, boards, fields) {
        res.send(boards);
    })
        var No = req.params.No;
        if (No) {
            var sql = 'SELECT * FROM board01 WHERE No=?';
            connection.query(sql, [No], function (err, board01, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('study', {boards: boards, board01: board01[0]});
                }
            });
        } else {
            res.render('study', {boards: boards});
        }
    });
}; */
/*
app.post('/main/study', function(req, res, next) {
    var sql = 'SELECT * FROM board01';
    connection.query(sql, function (err, boards, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('서버 오류');
        }
        var msg = " " + req.body.Content;

        res.send({
            msg2: msg
         })

    })
});
*/
// Ajax를 이렇게 사용하는게 아닌가 보다..

app.get(['/main/study', '/study/:No'], function (req, res) {
    var sql = 'SELECT No, Title, Content FROM board01';
    connection.query(sql, function (err, boards, fields) {
        var No = req.params.No;
        if (No) {
            var sql = 'SELECT * FROM board01 WHERE No=?';
            connection.query(sql, [No], function (err, board01, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('study', {boards: boards, board01: board01[0]});
                }
            });
        } else {
            res.render('study', {boards: boards});
        }
    });
});

app.get('/main/study/add', function(req, res) {
    var sql = 'SELECT Name, Title, Content FROM board01';
    connection.query(sql, function (err, board01, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('서버 오류!');
        }
        res.render('add', {boards: board01});
    });
});
app.post('/main/study/add', function (req, res) {
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
        res.render('dadd', {boards: board02});
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
    console.log('3000번 포트에 연결되었습니다!');
});

