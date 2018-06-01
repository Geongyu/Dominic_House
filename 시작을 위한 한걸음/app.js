
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var app = express();
var auth = require('./routes/auth.js');
app.use('/auth', auth);
var master = require('./routes/master.js');
app.use('/master', master);
var study = require('./routes/master.js');
app.use('/study', study);

// mysql 연동을 위한

// view engine setup
app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false}));
// catch 404 and forward to error handler
app.use(cookieParser());

app.get(['/main', '/'], function (req, res) {
    res.render('main');
});
app.get('/main/profile', function (req, res) {
    res.render('profile');
});

module.exports = app;

app.listen(3000, function(){
    console.log('3000번 포트에 연결되었습니다!');
});