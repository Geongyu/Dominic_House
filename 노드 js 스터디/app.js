var express = require('express');
var app = express();
 // 여기까지가 익스프레스 사용
app.locals.pretty = true;
 // jade를  통하여 생성되는 html함수를 정렬한다
app.set('views', './views');
app.set('view engine', 'jade');
 // jade를 사용하기 위함, views를 기본 폴더로 지정한다

app.use(express.static('public'));
// 정적 페이지를 사용함

/*
// 주석 처리된 해당코드는 단순한 쿼리 코드임
app.get('/topic', function(req, res){
    var topics = [
        'Javascript is...',
        'Nodejs is...',
        'Express is...'
    ];
    var str = `
    <a href="/topic?id=0">JavaScript</a><br>
    <a href="/topic?id=1">Nodejs</a><br>
    <a href="/topic?id=2">Express</a><br><br>
    `;
    var output = str + topics[req.query.id]
    res.send(output);
})
// 이게 무슨 코드더라.. 쿼리스트링 같은데.... */

app.get('/topic', function (req, res) {
    var topics = [
        'JavaScript is....',
        'Nodejs is....',
        'Express is....'
    ];
    var output = `
     <a href="/topic?id=0">JavaScript</a><Br>
      <a href="/topic?id=1">Nodejs</a><Br>
       <a href="/topic?id=2">Express</a><Br><br>
       ${topics[req.query.id]}
    `
    res.send(output);
})

app.get('/param/:module_id/:topic_id', function (req, res)  {
    res.json(req.params);
// 너는 어디서 왔니
})

app.get('/topic/:id', function(req, res){
    var topics = [
        'Javascript is....',
        'Nodejs is...',
        'Express is...'
    ];
    var output = `
  <a href="/topic?id=0">JavaScript</a><br>
  <a href="/topic?id=1">Nodejs</a><br>
  <a href="/topic?id=2">Express</a><br><br>
  ${topics[req.params.id]}
  `
    res.send(output);
})
app.get('/topic/:id/:mode', function(req, res){
    res.send(req.params.id+','+req.params.mode)
})

app.get('/template', function(req, res) {
    res.render('temp', {time:Date(), _title:'Jade'});
})
 // time과 _title이라는 변수를 선언함 temp라는 jade안에서 이용 되는 변수
 // 함수 내부는 변수값, 스크립트 명령어 둘 모두 실행 가능함

app.get('/', function(req, res){
    res.send('Hello home page');
});
app.get('/dynamic', function (req,res) {
    // 동적 파일을 해야하는 이유
    var lis ='';
    for(var i=0; i<5; i++){
        lis = lis + '<li>coding</li>';
    }
    // 자바스크립트 API 사용
    var time = Date();
   // <!-- 동적 파일 실행 -->
    var output = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    Hello, Dynamic!
    <ul>
    ${lis}
    </ul> 
    ${time}
    <!-- 이거를 쓸수 있는 이유는 ~ 밑에 있는것을 사용했기 떄문이다 -->
</body>
</html>`
    res.send(output);
})
app.get('/route', function(req,res){
    res.send('Hello Router, <img src="route.png">')
})
app.get('/login', function (req, res) {
    res.send('<h1>Login Please</h1>');
})
app.listen(3000, function(){
  console.log('Connected 3000 port!');
});