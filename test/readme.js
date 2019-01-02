/**
 * @file 生成readme.md
 * */
var doc = require('../src/index.js');
var fs = require('fs');
var md = doc(__dirname + '/../src/');
var tip = fs.readFileSync(__dirname + '/tip.md');
fs.writeFileSync(__dirname + '/../readme.md', md + '\n' + tip);
