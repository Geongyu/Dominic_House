var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs'); // 파일시스템 제어 모듈
var multer = require('multer'); // 파일 업로드를 위한 모듈
var upload = multer({ storage: 'uploads/' })
// dest를 사용하지 않고 스토리지를 사용할때에


// 아래에서 app을 express로 정하였음.
var http = require('http');
var connect = require('connect');

var app = connect();
var app2 = app;

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '111111'
});

var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
// 멀터 스토리지 사용하기 위하여 스토리지를 정의한다.

var upload = multer({ storage: _storage })

app.use(bodyParser.urlencoded({ extended:false})); // 바디파서 사용
app.set('views', './views'); // 템플릿이 저장되어 있는 위치 지정
app.set('view engine', 'jade'); // Jade 를 사용하기 위하여
app.locals.pretty = true; // jade를 줄바꿈 해준다
app.get('/upload', function (req, res) {
    res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
    console.log(req.file);
    res.send('Uploaded : '+ req.file.filename);
});

app.get('/topic/add', function(req, res) {
    var sql = 'SELECT Name, Title FROM board01';
    connection.query(sql, function (err, topics, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('일부분에서 오류가 있습니다.');
        }
        res.render('add', {topics: topics});
    });
});

app.post('/topic/add', function (req, res) // 포스트를 가져온다
{
    var Title = req.body.Title;
    var Content = req.body.Content;
    var Name = req.body.Name;
    var sql = 'INSERT INTO board01 (Title, Content, Name) VALUES(?, ?, ?)';
    connection.query(sql, [Title, Content, Name], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');

        } else {
            res.redirect('/topic/'+result.insertId);
        }
    });
})

connection.connect();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err;

    console.log('The solution is : ', rows[0].solution);
});
connection.end();

// view engine setup
app2.set('views', path.join(__dirname, 'views'));
app2.set('view engine', 'ejs');

app2.use(logger('dev'));
app2.use(express.json());
app2.use(express.urlencoded({ extended: false }));
app2.use(cookieParser());
app2.use(express.static(path.join(__dirname, 'public')));

app2.use('/', indexRouter);
app2.use('/users', usersRouter);

// catch 404 and forward to error handler
app2.use(function(req, res, next) {
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

module.exports = app2;
app2.listen(3000, function(){
    console.log('Connected 3000 port!');
});