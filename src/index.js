/**
 * # 懒人文档生成工具
 * 书写js代码,自动生成markdown文档
 * js代码格式参考test/src/index.js
 * @function lazy-doc
 * @param {string} folder 要生成文档的代码所在文件夹
 *          例如: __dirname + '/src'
 * @param output
 *        {string} 要写入的文件路径
 *        {callback} 文档计算完毕后的回调,有两个参数,所有文档合并后的string和分析后的文档列表
 * @param {object} config 配置@标记后的输出规则,可参考src/config.json
 * @install
 * npm install lazy-doc
 *
 * @uaeage
 * var doc = require('lazy-doc');
 * doc(folder,output);
 *
 * @todo
 *
 * @history
 * - 2016.08.17
 *     * 增加回调函数; 可以直接输出文件列表(输出到目录);
 * - 2016.08.15
 *     * 第一个@param之前和最后一个@param之后增加换行
 * - 2016.08.13
 *     * 标记符号@必须放在行的开头才能起作用,避免页内冲突
 *     * 增加@raw和@raw-end,不转换标签中的内容
 * - 2016.08.12 自动检查版本更新并提示
 * - 2016.08.11 修改index排序规则,index越大排在前面
 *
 **/
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
                            note.firstKeyVal = note.nextLine.replace(key, '').replace(/\Wvar\W/, '').replace(/[\{\}]*/g, '').replace(/\s*\=\s*/, '').trim();
                        }
                        note._filepath = filepath;
                        notes.push(note);
                    }
                });
            }
        } catch (e) {
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
    if (typeof output == 'string') {
        output = Path.resolve(output);
        var ext = Path.extname(output);
        if (ext && ext.length > 1) {
            logger.notice('Write to File:', output);
            mkdir(Path.dirname(output));
            fs.writeFileSync(output, write, 'utf8');
        } else {
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
    } else if (typeof output === 'function') {
        output(write, notes);
    }
    return write;
};