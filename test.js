var doc = require('./index.js');
var fs = require('fs');
var code = doc(fs.readFileSync('_readme.md', 'utf8'),{keep:true});
fs.writeFileSync('readme.md', code, 'utf8');