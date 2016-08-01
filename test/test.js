var doc = require('../src/index.js');
var fs = require('fs');

var output = doc(__dirname + '/src', __dirname + '/src/index.md');

console.log(output);