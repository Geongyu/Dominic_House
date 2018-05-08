var fs = require('fs');
var hello = fs.readFileSync('hello.txt', {encoding:'utf8'} );

console.log(hello);

// Async
console.log(2);
fs.readFile('hello.txt', {encoding:'utf-8'}, function (err, hello) {
    console.log(3);
    console.log(hello);
})
    console.log(4);

