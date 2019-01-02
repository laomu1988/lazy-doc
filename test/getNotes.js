var fs = require('fs');
var note = require('../src/getNotes');

var source = fs.readFileSync('./src/index.js', 'utf8');

console.log(note(source));
