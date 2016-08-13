/**
 * # 懒人文档生成工具
 * 书写js代码,自动生成markdown文档
 * js代码格式参考test/src/index.js
 * @function lazy-doc
 * @install
 * npm install lazy-doc
 * @uaeage
 * var doc = require('lazy-doc');
 * doc(folder,output);
 * @params
 * @param {string} folder 要生成文档的代码所在文件夹
 * @param {string} output 要写入的文件路径
 * @param {object} config 文件配置,可参考src/config.json
 *
 * @todo
 * @history
 * - 2016.08.13
 *     * 标记必须放在行的开头才能起作用,避免页内冲突
 *     * 增加raw和raw-end,不转换标签中的内容
 * - 2016.08.12 自动检查版本更新并提示
 * - 2016.08.11 修改index排序规则,index越大排在前面
 *
 **/
require('./update.js');
var config = require('./config');
var filter = require('filter-files');
var note2md = require('./note2md');
var fs = require('fs');
var getNotes = require('./getNotes');
var logger = require('logger-color');
logger.level = 'notice';


module.exports = function (path, output, _config) {
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
                    logger.debug('note:', note.firstKey, config.modules.indexOf(note.firstKey) >= 0);
                    note.file = filepath;
                    if (note.firstKey && config.modules.indexOf(note.firstKey) >= 0) {
                        // console.log('isModule');
                        var key = note.firstKey;
                        // 从下一行中读取函数名或者类名称
                        if (!note.firstKeyVal && note.nextLine && note.nextLine.indexOf(key) >= 0) {
                            // console.log('reset firstKeyVal');
                            note.firstKeyVal = note.nextLine.replace(key, '').replace(/\Wvar\W/, '').replace(/[\{\}]*/g, '').replace(/\s*\=\s*/, '').trim();
                        }
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
        md.push(note2md(note, _config));
        logger.debug('transform note to markdown:', md[md.length]);
    });
    var write = md.join('\n');
    if (typeof output == 'string') {
        logger.notice('Write to File:', output);
        fs.writeFileSync(output, write, 'utf8');
    }
    return write;
};