/**
 * # 懒人文档生成工具
 * 书写js代码,自动生成markdown文档
 * js代码格式参考test/src/index.js
 * @function lazy-doc
 * @param {string} folder 要生成文档的代码所在文件夹
 *          例如: __dirname + '/src'
 * @param {string|Function} output
 *        当为string时，表示要写入的文件路径
 *        当为Function时，文档计算完毕后的回调,有两个参数,所有文档合并后的string和分析后的文档列表
 * @param {object} config 配置@标记后的输出规则,包含两个参数key和val,当时字符串时自动替换{key}和{val}为文档值,是函数时将被替换为返回内容. 可参考src/config.json
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
 *      default: '### {key}\n{val}', // 修改默认规则
 *      source: '### 源代码地址: {val}'  // 自己制定规则
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
require('./update.js');
var config = require('./config');
var filter = require('filter-files');
var note2md = require('./note2md');
var fs = require('fs');
var mkdir = require('mk-dir');
var Path = require('path');
var getNotes = require('./getNotes');
var logger = require('logger-color');
logger.level = 'notice';

module.exports = function (path, output, _config) {
    path = Path.resolve(path);
    var files = filter.sync(path);
    var notes = [];
    _config = Object.assign({}, config, _config);
    files.forEach(function (filepath) {
        try {
            logger.info('analysis file: ', filepath);
            var source = fs.readFileSync(filepath, 'utf8');
            var _notes = getNotes(source);
            if (_notes && _notes.length > 0) {
                logger.debug('notes-length:', _notes.length);
                _notes.forEach(function (note) {
                    logger.debug('note:', note.firstKey);
                    note.file = filepath;
                    if (note.firstKey) {
                        // console.log('isModule');
                        var key = note.firstKey;
                        // 从下一行中读取函数名或者类名称
                        if (!note.firstKeyVal && note.nextLine && note.nextLine.indexOf(key) >= 0) {
                            // console.log('reset firstKeyVal');
                            note.firstKeyVal = note.nextLine.replace(key, '')
                                .replace(/\Wvar\W/, '')
                                .replace(/[\{\}]*/g, '')
                                .replace(/\s*\=\s*/, '')
                                .trim();
                        }

                        note._filepath = filepath;
                        notes.push(note);
                    }

                });
            }

        }
        catch (e) {
            console.log(e);
        }
    });

    notes.sort(function (k1, k2) {
        if (k1.index !== k2.index) {
            return k2.index - k1.index;
        }

        if (k1.firstKeyVal !== k2.firstKeyVal) {
            return k1.firstKeyVal > k2.firstKeyVal;
        }

        return k1.note > k2.note;
    });
    logger.debug('notes-all-length:', notes.length);
    var md = [];
    notes.forEach(function (note) {
        note._md = note2md(note, _config);
        md.push(note._md);
        logger.debug('transform note to markdown:', md[md.length]);
    });
    var write = md.join('\n');
    if (typeof output === 'string') {
        output = Path.resolve(output);
        var ext = Path.extname(output);
        if (ext && ext.length > 1) {
            logger.notice('Write to File:', output);
            mkdir(Path.dirname(output));
            fs.writeFileSync(output, write, 'utf8');
        }
        else {
            // 写入文件列表
            if (path.indexOf('*') >= 0) {
                path = Path.dirname(path.substr(0, path.indexOf('*')));
            }

            logger.notice('Write to Direction:', output);
            for (var i = 0; i < notes.length; i++) {
                var note = notes[i];
                var filepath = output + '/' + note._filepath.replace(path, '');
                var filename = Path.basename(filepath);
                filepath = Path.resolve(Path.dirname(filepath) + '/' + filename.substr(0, filename.lastIndexOf('.')) + '.md');
                console.log('Write to File:', filepath);
                mkdir(Path.dirname(filepath));
                fs.writeFileSync(filepath, note._md, 'utf8');
            }
        }
    }
    else if (typeof output === 'function') {
        output(write, notes);
    }

    return write;
};
