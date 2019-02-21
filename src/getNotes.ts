/**
 * @file 根据内容,读取其中注释
 **/
const utils = require('./utils');
/* eslint-disable fecs-camelcase */

/**
 * 从代码或者文件中获得注释内容
 * @param {string} source 要转换的文本内容
 * @return {[Note]} 返回注释内容列表
 *
 * @typedef {Object} Note 解析后注释内容结构
 * @property {string} source 注释原文
 * @property {string} key 注释关键词
 * @property {string} result 解析后的文本内容
 * @property {number} start 注释开始位置
 * @property {number} end 注释结束位置
 */
export default function getNotes(source) {
    if (!source || typeof source !== 'string') {
        return null;
    }

    let list = [];
    source.replace(/\/\*\*([\w\W]*?)\*\/[\s\n]*([^\n]*)/g, function (all: string, _note: string, nextLine: string) {
        let note = {
            _note: _note,
            note: '',
            index: 0,
            firstKey: '',
            firstKeyVal: '',
            notes: [],
            nextLine: nextLine
        };
        // 删除每行开始的*
        _note = note.note = note._note.replace(/\n ?\* ?/g, '\n').trim();
        let funcName = utils.getFunctionName(nextLine);
        console.log('FuncName', funcName);
        if (_note[0] !== '@' && funcName) {
            note.note = _note = '@function ' + funcName + ' ' + _note;
        }
        // console.log(_note);

        let now_reach = 0;
        note.note.replace(/(^|\n)\s*@([\w\-]*)/g, (all: string, ch: string, key: string, index: number) => {
            let start = index + all.length - 1;
            let end;
            if (start < now_reach || key === 'raw-end') {
                // @raw-end还未结束
                return '';
            }

            if (key === 'raw') {
                end = _note.indexOf('\n@raw-end', start);
            }
            else {
                end = _note.indexOf('\n@', start);
            }
            now_reach = end > 0 ? end : _note.length;
            let val = _note.substring(start + 1, now_reach);
            if (val) {
                val = val.trimRight();
            }

            // console.log('key:', key, val, '\n---------');

            if (key === 'index') {
                // index 是用来排序的
                note.index = parseInt(val, 10) || 0;
                return '';
            }

            let isFirst = false;
            if (!note.firstKey) {
                note.firstKey = key.trim();
                if (val && val.length > 0) {
                    note.firstKeyVal = val;
                }

                note.notes = [];
                isFirst = true;
            }

            note.notes.push({key: key, val: val});
            if (isFirst && index > 0) {
                let desc = note.note.substr(0, index).trimRight();
                if (desc) {
                    note.notes.push({key: 'desc', val: desc});
                }
            }
            return '';
        });

        note.index = note.index || 0;

        list.push(note);
        return '';
    });
    return list;
}