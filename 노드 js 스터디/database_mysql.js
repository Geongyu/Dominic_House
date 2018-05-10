var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '111111',
    database : 'o2'
});

connection.connect();

var sql = 'SELECT * FROM topic'
connection.query(sql, function (err, rows, fields) {
    if(err) {
        console.log(err);
    } else {
        console.log('rows', rows);
        console.log('fields', fields);
    }
});
connection.end();