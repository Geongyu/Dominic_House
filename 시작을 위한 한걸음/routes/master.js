var express = require('express');
var router = express.Router();

        var route = require('express').Router();
        var connection = require('../config/db')();
    route.get(['/master_main', '../master_main', '/auth/master_main'], function (req, res) {
        if (req.user) {
            res.render('session_main')
        } else {
            res.send('<script type="text/javascript">alert("올바르지 않은 사용자 입니다 사용자의 정보를 서버로 전송합니다.");</script>');
        }
    });

    route.get(['/master_main/master_study', '/master_main/master_study/:No'], function (req, res) {
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
                        res.render('session_study', {boards: boards, board01: board01[0]});
                    }
                });
            } else {
                res.render('session_study', {boards: boards});
            }
        });
    });

    route.get('/master_main/master_study/add', function (req, res) {
        var sql = 'SELECT Name, Title, Content FROM board01';
        connection.query(sql, function (err, board01, fields) {
            if (err) {
                console.log(err);
                res.status(500).send('서버 오류!');
            }
            res.render('study_add', {boards: board01});
        });
    });

    route.post('/master_main/master_study/add', function (req, res) {
        var Title = req.body.Title;
        var Content = req.body.Content;
        var Name = req.body.Name;
        var sql = 'INSERT INTO board01 (Title, Content, Reddate, Name) VALUES(?, ?, now(), ?)';
        connection.query(sql, [Title, Content, Name], function (err, result, fields) {
            if (err) {
                console.log(err);
                res.status(500).send('Server Error');
            } else {
                res.redirect('/master_main/master_study/' + result.InsertId);
            }
        })
    })
    module.exports = router;
    return router;