var express = require('express'),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    session = require('express-session'),
    cookieParser = require('cookie-parser');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var app = express();
// 로컬에서 실험하고자함
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'board'
});
connection.connect();
// mysql 연동을 위한

app.use(session({
    secret: 'atc54321',
    resave: false,
    saveUninitialized: true
}));
// 익스프레스 세션 암호화

// view engine setup
app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false}));
// catch 404 and forward to error handler
app.use(cookieParser());
app.use(flash());
//app.use(bodyParser.json);

app.use(passport.initialize());
app.use(passport.session());
// 미들웨어 설정

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    // DB에서 ID를 이용하여 User를 얻어 Done 호출
    connection.query('SELECT * FROM mastertable WHERE `id`=?', [id], function (err, rows) {
        var user = rows[0];
        done(err, user);
    });
});
app.use(function(err, req, res, next) {
    console.log(err);
});
passport.use(new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
}, function (username, password, done) {
    connection.query('SELECT * FROM mastertable WHERE `username`=?', [username], function (err, rows) {
        var user = rows[0];
        if(err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message : '아이디가 다릅니다'});
        }
        if (user.password !== password) {
            return done(null, false, { message : '비밀번호가 다릅니다.'});
        }
        return done(null, user);
    });
}));

app.get(['/main', '/'], function (req, res) {
    res.render('main');
});
app.get('/main/profile', function (req, res) {
    res.render('profile');
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
*/

app.post('/login', passport.authenticate('local',{
    successRedirect: '/master_main',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/login', function (req, res) {
    console.log(req.flash('error'));
    if (req.user) {
        res.render('master_main');
    } else {
        res.render('login');
    }
});

app.get('/master_main', function(req, res) {
    if(req.user) {
        res.render('master_main')
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
        }
    });
});

app.get('/logout', (req, res) => {
    delete req.session.user_uid;
    res.redirect('/main');
});

app.get(['/master_main/master_study', '/master_main/master_study/:No'], function (req, res) {
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
                    res.render('master_study', {boards: boards, board01: board01[0]});
                }
            });
        } else {
            res.render('master_study', {boards: boards});
        }
    });
});

app.get('/master_main/master_study/add', function(req, res) {
    var sql = 'SELECT Name, Title, Content FROM board01';
    connection.query(sql, function (err, board01, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('서버 오류!');
        }
        res.render('add', {boards: board01});
    });
});

app.post('/master_main/master_study/add', function (req, res) {
    var Title = req.body.Title;
    var Content = req.body.Content;
    var Name = req.body.Name;
    var sql = 'INSERT INTO board01 (Title, Content, Reddate, Name) VALUES(?, ?, now(), ?)';
    connection.query(sql, [Title, Content, Name], function (err, result, fields) {
        if(err) {
            console.log(err);
            res.status(500).send('Server Error');
        } else {
            res.redirect('/master_main/master_study/'+result.InsertId);
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