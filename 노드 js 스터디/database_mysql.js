var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '111111',
    database : 'o2'
});

connection.connect();
/* 셀렉트문
var sql = 'SELECT * FROM topic'
connection.query(sql, function (err, rows, fields) {
    if(err) {
        console.log(err);
    } else {
        for(var i=0; i<rows.length; i++){
            console.log(rows[i].title);
        }
    }
});
 */
/*
var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'graphittie'];
// 파람으로 데이터를 가져와서 밑에 추가 시켜줫음, SQL 인젝션을 막을 수 있음
connection.query(sql, params, function (err, rows, fields) {
    if(err){
        console.log(err);
    } else {
        console.log(rows);
    }
});
*/
var sql = /* 'UPDATE topic SET title=?, author=? WHERE id=?'; */
        'DELETE FROM topic WHERE id=?';
var params = [1];
// 파람으로 데이터를 가져와서 밑에 추가 시켜줫음, SQL 인젝션을 막을 수 있음
connection.query(sql, params, function (err, rows, fields) {
    if(err){
        console.log(err);
    } else {
        console.log(rows);
    }
});
connection.end();