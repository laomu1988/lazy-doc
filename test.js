var doc = require('./index.js');
var fs = require('fs');

var content = fs.readFileSync('test.md', 'utf8');

doc.config.scopes.push({
    start: '/**start*/',
    end: '/**end*/'
});

doc.on('analysis', function (data) {
    console.log('analysis',data);
});


var out = doc(content);
fs.writeFileSync('test_out.md', out, 'utf8');