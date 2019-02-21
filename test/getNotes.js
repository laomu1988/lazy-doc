/**
 * @file 测试获取notes函数
 */
let fs = require('fs');
let note = require('../src/getNotes');

let source = fs.readFileSync('./src/getNotes.js', 'utf8');

console.log(JSON.stringify(note(source), null, 4));
