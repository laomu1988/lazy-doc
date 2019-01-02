var doc = require('../src/index.js');
var fs = require('fs');

var output = doc(__dirname + '/src', __dirname + '/dest/all.md');
doc(__dirname + '/src', __dirname + '/dest/');

console.log(output);
