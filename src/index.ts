/**
 * @file 懒人文档生成工具
 * 书写js代码,自动生成markdown文档
 * js代码格式参考test/src/index.js
 **/

/**
 * @function lazy-doc 懒人文档生成工具
 * @param {string} folder 要生成文档的代码所在文件夹
 *          例如: __dirname + '/src'
 * @param {string|Function} output
 *        当为string时，表示要写入的文件路径
 *        当为Function时，文档计算完毕后的回调,有两个参数,所有文档合并后的string和分析后的文档列表
 * @param {object} options 配置项。配置@标记后的输出规则,包含两个参数key和val,当时字符串时自动替换{key}和{value}为文档值,是函数时将被替换为返回内容. 可参考https://github.com/laomu1988/lazy-doc/blob/master/src/template.ts
 *
 * @install
 * npm install lazy-doc
 *
 * @usage
 * var doc = require('lazy-doc');
 * doc(folder, output, config);
 *
 * @example
 * var doc = require('lazy-doc');
 * doc(__dirname + '/src', __dirname + '/readme.md',{
 *      default: '### {key}\n{value}', // 修改默认规则
 *      source: '### 源代码地址: {value}'  // 自己制定规则
 * });
 *
 * @todo
 * * [ ] 生成数据数组
 * * [ ] Markdown内部配置后自更新
 * * [ ] 函数参数改为表格输出
 *
 * @history
 * * [修改记录](https://github.com/laomu1988/lazy-doc/blob/master/package.json)
 **/

/* eslint-disable fecs-camelcase */
import * as filter from 'filter-files';
import * as fs from 'fs';
import * as Path from 'path';
import mkdir from 'mk-dir';
import templates from './templates';
import * as utils from './utils';

module.exports = function (path, output, options) {
    path = Path.resolve(path);
    let files = isDirectory(path) ? filter.sync(path) : [path];
    let marks = [];
    options = Object.assign({templates}, options);
    files.forEach(function (filepath) {
        try {
            let source = fs.readFileSync(filepath, 'utf8');
            let notes = utils.getNotes(source);
            let mark = notes.map(note => utils.getNoteMark(note, source));
            marks.forEach(mark => mark.filepath = filepath);
            marks = marks.concat(mark);
        }
        catch (e) {
            console.log(e);
        }
    });
    marks.sort((m1, m2) => m1.index - m2.index);
    let markdown = marks.map(mark => {
        mark.markdown = utils.parseNoteMark(mark, options);
        return mark.markdown;
    }).join('\n');
    console.log('marks', JSON.stringify(marks, null, 4));
    
    if (typeof output === 'string' && output) {
        output = Path.resolve(output);
        if (!isDirectory(output)) {
            // 写入单个文件
            fs.writeFileSync(output, markdown, 'utf8');
        }
        else {
            // 写入文件列表
            if (path.indexOf('*') >= 0) {
                path = Path.dirname(path.substr(0, path.indexOf('*')));
            }
            let mds = {};
            marks.forEach(m => {
                mds[m.filename] = mds[m.filename] || '';
                mds[m.filename] += m.markdown;
            });
            for(let filepath in mds) {
                let markdown = mds[filepath];
                filepath = output + '/' + filepath.replace(path, '');
                filepath = filepath + '.md';
                console.log('Write to File:', filepath);
                mkdir(Path.dirname(filepath));
                fs.writeFileSync(filepath, markdown, 'utf8');
            }
        }
    }
    else if (typeof output === 'function') {
        output(markdown, marks);
    }

    return markdown;
};

function isDirectory(path) {
    let stat = fs.statSync(path);
    return stat.isDirectory();
}
