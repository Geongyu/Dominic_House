
    var connection = require('../config/db')();
    var route = require('express').Router();

    route.get(['/main/study', '/study/:No'], function (req, res) {
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
    module.exports = router;
    return router;