var doc = require('./index.js');
var fs = require('fs');

var content = fs.readFileSync('index.js', 'utf8');

doc.config.scopes = [{
    start: '/*start*/',
    end: '/*end*/'
}, {
    start: '//start',
    end: '//end'
}, {
    start: '/**',
    end: '*/'
}];

doc.on('analysis', function (data) {
    console.log('分析数据: ', data.block);
});


var out = doc(content);
fs.writeFileSync('readme.md', out, 'utf8');