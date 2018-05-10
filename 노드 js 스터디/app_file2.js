var express = require("express");
var app = express(); // 익스프레스 추가
var bodyParser = require('body-parser'); // 바디파서 인클루드
var fs = require('fs'); // 파일시스템 제어 모듈

app.use(bodyParser.urlencoded({ extended:false})); // 바디파서 사용
app.set('views', './views_file'); // 템플릿이 저장되어 있는 위치 지정
app.set('view engine', 'jade'); // Jade 를 사용하기 위하여
app.locals.pretty = true; // jade를 줄바꿈 해준다

app.get('/topic/new', function(req, res){
    fs.readdir('data', function (err, files)  // 파일 목록 불러오기 위하여
    {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    res.render('new', {topics:files});
})
});

app.get(['/topic', '/topic/:id'], function (req, res) {
    fs.readdir('data', function (err, files)  // 파일 목록 불러오기 위하여
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

app.post('/topic', function (req,res) // 포스트를 가져온다
 {
     var title = req.body.title;
     var description = req.body.description;
     fs.writeFile('data/'+title, description, function (err) {
         if(err){
             console.log(err);
            res.status(500).send('Internal Server Error');
         }
         res.redirect('/topic/'+title);
     });

})
app.listen(3000, function () {
    console.log('connected, 3000 port!');
})