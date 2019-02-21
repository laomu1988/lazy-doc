/**
 * @file 生成readme.md
 * */
const doc = require('../lib/index.js');
const fs = require('fs');
const md = doc(__dirname + '/../src/index.ts');
const tip = fs.readFileSync(__dirname + '/tip.md');
fs.writeFileSync(__dirname + '/../readme.md', md + '\n' + tip);
