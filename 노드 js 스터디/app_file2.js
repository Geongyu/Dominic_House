/* var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/')
      },
  filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
})
var upload = multer({ storage: _storage })
    var fs = require('fs');
var mysql = require('mysql');
var conn = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '111111',
      database : 'o2'
});
conn.connect();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.use('/user', express.static('uploads'));
app.set('views', './views_mysql');
app.set('view engine', 'jade');
app.get('/upload', function(req, res){
      res.render('upload');
    });
app.post('/upload', upload.single('userfile'), function(req, res){
      res.send('Uploaded : '+req.file.filename);
    });
app.get('/topic/new', function(req, res){
      fs.readdir('data', function(err, files){
            if(err){
                  console.log(err);
                  res.status(500).send('Internal Server Error');
                }
            res.render('new', {topics:files});
          });
    });
app.get(['/topic', '/topic/:id'], function(req, res){
      var sql = 'SELECT id,title FROM topic';
      conn.query(sql, function(err, topics, fields){
            var id = req.params.id;
            if(id){
                  var sql = 'SELECT * FROM topic WHERE id=?';
                  conn.query(sql, [id], function(err, topic, fields){
                        if(err){
                              console.log(err);
                              res.status(500).send('Internal Server Error');
                            } else {
                              res.render('view', {topics:topics, topic:topic[0]});
                            }
                      });
                } else {
                  res.render('view', {topics:topics});
                }
          });
    });
app.post('/topic', function(req, res){
      var title = req.body.title;
      var description = req.body.description;
      fs.writeFile('data/'+title, description, function(err){
            if(err){
                  console.log(err);
                  res.status(500).send('Internal Server Error');
                }
            res.redirect('/topic/'+title);
          });
    })
app.listen(3000, function(){
      console.log('Connected, 3000 port!');
    })


*/
 var express = require("express");
var app = express(); // 익스프레스 추가
var bodyParser = require('body-parser'); // 바디파서 인클루드
var fs = require('fs'); // 파일시스템 제어 모듈
var multer = require('multer'); // 파일 업로드를 위한 모듈
var upload = multer({ storage: 'uploads/' })
    // dest를 사용하지 않고 스토리지를 사용할때에는 추가 설정이 필요하다
    // dest만세!!!!!!!!!!!!!!!!!!!!!!!
var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '111111',
    database : 'o2'
});

connection.connect();



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
app.set('views', './views_mysql'); // 템플릿이 저장되어 있는 위치 지정
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
    var sql = 'SELECT id, title FROM topic';
    connection.query(sql, function (err, topics, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('add', {topics: topics});
    });
});

        app.post('/topic/add', function (req, res) // 포스트를 가져온다
        {
            var title = req.body.title;
            var description = req.body.description;
            var author = req.body.author;
            var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
            connection.query(sql, [title, description, author], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');

                } else {
                    res.redirect('/topic/'+result.insertId);
                }
            });
    })
           /* fs.writeFile('data/' + title, description, function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                res.redirect('/topic/' + title);
        }
        res.render('add', {topics:topics});
    }); */
    /* fs.readdir('data', function (err, files)  // 파일 목록 불러오기 위하여
    {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    res.render('add', {topics:files});
}) */


app.get(['/topic', '/topic/:id'], function (req, res) {
    var sql = 'SELECT id, title FROM topic';
    connection.query(sql, function (err, topics, fields) {
        var id = req.params.id;
        if(id){
            var sql = 'SELECT * FROM topic WHERE id=?';
            connection.query(sql, [id], function(err, topic, fields){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Sever Error');
                } else {
                    res.render('view', {topics:topics, topic:topic[0]});
                }
            });
        } else {
            res.render('view', {topics:topics});

        }
        //  res.render('view', {topics: topics});
    });
});
    /* fs.readdir('data', function (err, files)  // 파일 목록 불러오기 위하여
     {
         if(err) {
             console.log(err);
             res.status(500).send('Internal Server Error');
         }
         var id = req.params.id;
         if(id){
             // id값이 있을때
             fs.readFile('data/' + id, 'utf8', function (err, data) {
                 if (err) {
                     console.log(err);
                     res.status(500).send('Internal Server Error');
                 }
                 res.render('view', {topics: files, title: id, description:data});
             })
         } else {
             // id 값이 없을 때
             res.render('view', {topics: files, title:'Welcome', description:'Hello Java Script for server.'});
         }
     })
 });
*/
/* app.get('/topic/:id', function (req,res) {
    var id = req.params.id; // 파일 자동으로 읽기
    fs.readdir('data', function (err, files)  // 파일 목록 불러오기 위하여
    {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }

        fs.readFile('data/' + id, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            res.render('view', {topics: files, title: id, description:data});
        })
    })
})

*/
app.get(['/topic/:id/edit'], function(req, res){
      var sql = 'SELECT id,title FROM topic';
      connection.query(sql, function(err, topics, fields){
            var id = req.params.id;
            if(id){
                  var sql = 'SELECT * FROM topic WHERE id=?';
                  connection.query(sql, [id], function(err, topic, fields){
                        if(err){
                              console.log(err);
                              res.status(500).send('Internal Server Error');
                            } else {
                              res.render('edit', {topics:topics, topic:topic[0]});
                            }
                      });
                } else {
                  console.log('There is no id.');
                  res.status(500).send('Internal Server Error');
                }
          });
    });
app.post(['/topic/:id/edit'], function(req, res){
      var title = req.body.title;
      var description = req.body.description;
      var author = req.body.author;
      var id = req.params.id;
      var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
      connection.query(sql, [title, description, author, id], function(err, result, fields){
            if(err){
                  console.log(err);
                  res.status(500).send('Internal Server Error');
                } else {
                  res.redirect('/topic/'+id);
                }
          });
    });
/*
app.get(['/topic/:id/edit'], function (req, res) {
    var sql = 'SELECT id, title FROM topic';
    connection.query(sql, function (err, topics, fields) {
        var id = req.params.id;
        if(id){
            var sql = 'SELECT * FROM topic WHERE id=?';
            connection.query(sql, [id], function(err, topic, fields){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Sever Error');
                } else {
                    res.render('edit', {topics:topics, topic:topic[0]});
                }
            });
        } else {
           console.log('There is no id.');
            res.render('view', {topics:topics});

        }
        //  res.render('view', {topics: topics});
    });
});

app.post(['/topic/:id/edit'], function (req, res) {
    var title = req.body.title;
    var description = req.body.title;
    var author = req.body.title;
    var id = req.params.id;
    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    connection.query(sql, [title, description, author, id], function (err, result, fields) {
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/topic/'+id);
        }
    });
}); */
// 편집기능
app.get('/topic/:id/delete', function(req, res){
      var sql = 'SELECT id,title FROM topic';
      var id = req.params.id;
      connection.query(sql, function(err, topics, fields){
            var sql = 'SELECT * FROM topic WHERE id=?';
            connection.query(sql, [id], function(err, topic){
                  if(err){
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                      } else {
                        if(topic.length === 0){
                              console.log('There is no record.');
                              res.status(500).send('Internal Server Error');
                            } else {
                              res.render('delete', {topics:topics, topic:topic[0]});
                            }
                      }
                });
          });
    });
app.post('/topic/:id/delete', function(req, res){
      var id = req.params.id;
      var sql = 'DELETE FROM topic WHERE id=?';
      connection.query(sql, [id], function(err, result){
            res.redirect('/topic/');
          });
    });

/*
app.get('/topic/:id/delete', function (req, res) {
    var sql = 'SELECT id, title FROM topic';
    var id = req.params.id;
    connection.query(sql, function (err, topics, fields)  {
        var sql = 'SELECT * FROM topic WHERE id=?';
        connection.query(sql, [id], function (err, rows) {
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                if(topic.length === 0) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('delete', {topics:topics, topic:topic[0]});
                }
              //  res.send(topic);
            }
        })
       //  res.render('delete', {topics:topics});
    });
  //  res.render('delete', topics, topics);
});
//삭제 사용자의 요청을 받아
app.post('/topic:id/delete', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id=?';
    connection.query(sql, [id], function (err, result) {
        res.redirect('/topic/');
    });
});
  /*  app.post('/topic', function (req, res) // 포스트를 가져온다
    {
        var title = req.body.title;
        var description = req.body.description;
        fs.writeFile('data/' + title, description, function (err) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            res.redirect('/topic/' + title);
        });

    }) */
    app.listen(3000, function () {
        console.log('connected, 3000 port!');
    })
