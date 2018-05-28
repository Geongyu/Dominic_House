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

const users = [
    {
        user_id: 'root',
        user_nickname: 'Root',
        user_pwd: '123456'
    },
    {
        user_id: 'mil',
        user_nickname: '육군군사기밀',
        user_pwd: '1q2w3e4r'
    }
]
const findUser = (user_id, user_pwd) => {
    // id와 password가 일치하는 유저 찾는 함수, 없으면 undefined 반환
    return users.find( v => (v.user_id === user_id && v.user_pwd === user_pwd) );
}
const findUserIndex = (user_id, user_pwd) => {
    // 일치하는 유저의 index값(유니크) 반환
    return users.findIndex( v => (v.user_id === user_id && v.user_pwd === user_pwd) );
}

app.get(('/login'), function(req, res){
    res.render('login')
});
app.post('/login', (req, res) => {
    const body = req.body; // body-parser 사용
    if( findUser( body.user_id, body.user_pwd ) ) {
        // 해당유저가 존재한다면
        req.session.user_uid = findUserIndex( body.user_id, body.user_pwd ); //유니크한 값 유저 색인 값 저장
        res.render('master_main');
    } else {
        res.send('<script type="text/javascript">alert("올바르지 않은 사용자 입니다 사용자의 정보를 서버로 전송합니다.");</script>');
    }
});

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
app.get('/logout', (req, res) => {
    delete req.session.user_uid;
    res.redirect('/main');
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

