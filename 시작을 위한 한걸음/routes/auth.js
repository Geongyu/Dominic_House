var express = require('express');
var router = express.Router();
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session = require('express-session');
var mysql = require('mysql');
router.use(flash());
//app.use(bodyParser.json);
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var app = express();
app.set('view engine', 'jade');
app.set('views', './views');
router.use(bodyParser.urlencoded({ extended: false}));
// catch 404 and forward to error handler
router.use(cookieParser());

router.use(session({
    secret: 'atc54321',
    resave: false,
    saveUninitialized: true
}));
// 익스프레스 세션 암호화

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'board'
});
connection.connect();
router.use(passport.initialize());
router.use(passport.session());
// 미들웨어 설정


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
        return done(null, user, {message : '로그인 성공!'});
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});
passport.deserializeUser(function (username, done) {
    // DB에서 ID를 이용하여 User를 얻어 Done 호출
    connection.query('SELECT * FROM mastertable WHERE `username`=?', [username], function (err, rows) {
        var user = rows[0];
        done(err, user);
    });
});

router.post('/login', passport.authenticate('local',{
    successRedirect: '/../master_main',
    failureRedirect: '/login',
    failureFlash: true
}));
router.get('/login', function (req, res) {
    console.log(req.flash('error'));
    if (req.user) {
        res.render('session_main');
    } else {
        res.render('login');
    }
});

router.get('/logout', (req, res) => {
    delete req.session.user_uid;
    res.redirect('/main');
});
module.exports = router;
return router;