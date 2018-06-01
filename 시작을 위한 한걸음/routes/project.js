var express = require('express');
var router = express.Router();
    var route = require('express').Router();
    var connection = require('../config/db')();

    route.get(['/main/project', '/project'], function (req, res) {
        var sql = 'SELECT * FROM board02';
        connection.query(sql, function (err, boards, fields) {
            var no = req.params.no;
            if (no) {
                var sql = 'SELECT * FROM board02 WHERE no=?';
                connection.query(sql, [no], function (err, board02, fields) {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.render('project', {boards: boards, board01: board02[0]});
                    }
                });
            } else {
                res.render('project', {boards: boards});
            }
        });
    });
    route.get('/project/read/:no',function (req,res,next) {
        /* GET 방식의 연결이므로 read 페이지 조회에 필요한 idx 값이 url 주소에 포함되어 전송됩니다.
         이 idx값을 참조하여 DB에서 해당하는 정보를 가지고 옵니다.
        * url에서 idx 값을 가져오기 위해 request 객체의 params 객체를 통해 idx값을 가지고 옵니다.*/
        var no = req.params.no;
        console.log("no : "+no);
        /*
        * Node는 JSP에서 JDBC의 sql문 PreparedStatement 처리에서와 같이 sql문을 작성할 때
        * ? 를 활용한 편리한 쿼리문 작성을 지원합니다.
        * Node에서 참조해야할 인자값이 있을 때 ? 로 처리하고
        * []를 통해 리스트 객체를 만든 후 ? 의 순서대로 입력해주시면 자동으로 쿼리문에 삽입됩니다.
        * 아래에는 ?에 idx값이 자동으로 매핑되어 쿼리문을 실행합니다.
        * */
        /**/
        connection.beginTransaction(function(err){
            if(err) console.log(err);
            connection.query('update board set hit=hit+1 where idx=?', [idx], function (err) {
                if(err) {
                    /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                    console.log(err);
                    connection.rollback(function () {
                        console.error('rollback error1');
                    })
                }
                connection.query('select idx,title,content,writer,hit,DATE_FORMAT(moddate, "%Y/%m/%d %T")' +
                    ' as moddate,DATE_FORMAT(regdate, "%Y/%m/%d %T") as regdate from board where idx=?',[idx],function(err,rows)
                {
                    if(err) {
                        /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                        console.log(err);
                        connection.rollback(function () {
                            console.error('rollback error2');
                        })
                    }
                    else {
                        connection.commit(function (err) {
                            if(err) console.log(err);
                            console.log("row : " + rows);
                            res.render('read',{title:rows[0].title , rows : rows});
                        })
                    }
                })
            })
        })
    })


    route.get('/project/add', function(req, res) {
        var sql = 'SELECT title, content FROM board02';
        connection.query(sql, function (err, board02, fields) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            res.render('project_add', {boards: board02});
        });
    });
    route.post('/project/add', function (req, res) {
        var title = req.body.title;
        var content = req.body.content;
        var sql = 'INSERT INTO board02 (title, content) VALUES(?, ?)';
        connection.query(sql, [title, content], function (err, result, fields) {
            if(err) {
                console.log(err);
                res.status(500).send('Server Error');
            } else {
                res.redirect('/main/project'+result.InsertId);
            }
        })
    });
module.exports = router;
return router;