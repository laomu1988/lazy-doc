/**
 * @file 文件夹转换测试
 */
/* global test */
const fs = require('fs');
const glob = require('glob');
const doc = require('../src/index.ts');
doc(__dirname + '/src', __dirname + '/output/');
const dests = glob.sync(__dirname + '/dest/*.*')
    .map(v => v.replace(__dirname + '/dest/', ''))
    .map(filepath => [
        filepath,
        __dirname + '/dest/' + filepath,
        __dirname + '/output/' + filepath
    ]);

console.log('dests', dests);
test.each(dests)('parse %s', (filepath, dest, output) => {
    if (!fs.existsSync(output)) {
        throw new Error(output + ' do not exist');
    }
    expect(fs.readFileSync(dest, 'utf8')).toEqual(fs.readFileSync(output, 'utf8'));
});
