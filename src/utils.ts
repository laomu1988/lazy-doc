/**
 * @file 公共函数
 */

/**
 * 转换步骤：
 * source源文件->note查找注释->注释中标记mark->标记转换为markdown->写入文件
 */

const debug = require('debug')('lazydoc');

/**
 * 从代码中查找注释模块并取得`@`标记
 * @param source 源文件
 * @return {[Mark]} 标记列表
 */
export function getMarks(source) {
    let notes = getNotes(source);
    let marks = [];
    notes.forEach(note => {
        let list = getNoteMark(note, source);
        marks = marks.concat(list);
    });
    let index = marks[0] ? marks[0].index || 0 : 0;
    if (marks[0]) {
        marks[0].index = index;
    }
    return marks;
}


/**
 * 取得代码中的块注释内容并清理掉前面的*
 * @param {string} source 代码内容
 * @return {[Note]} 注释内容
 */
export function getNotes(source: string) {
    if (!source || typeof source !== 'string') {
        return null;
    }
    let list = [];
    source.replace(/\/\*\*([\w\W]*?)\*\/[ \f\r\t\v]*/g, function (block: string, content: string, start) {
        content = content.replace(/\n[ ]*\* ?/g, '\n').trim();
        let endPosition = start + block.length;
        let nextBrPosition = source.indexOf('\n', endPosition + 1);
        let nextLine = nextBrPosition >= 0
            ? source.substring(endPosition, nextBrPosition)
            : source.substring(endPosition);
        if (nextLine[0] === '\n') {
            nextLine = nextLine.substring(1);
        }
        list.push({
            position: start,
            content,
            nextLine,
            block
        });
        return block;
    });
    return list;
}

/**
 * @typedef {Object} Note 解析后注释内容结构
 * @property {string} block 注释原文
 * @property {string} content 注释内容(清理掉前面的*后剩余部分)
 * @property {number} position 注释开始位置
 * @property {string} nextLine 注释结束后后面一行内容（注释结束后不是换行符，则直接取注释后内容）
 */
interface Note {
    block: string,
    content: string,
    position: number,
    nextLine: string,
}

/**
 * 取得注释中用mark标记的代码
 * @param {Object} note
 * @param {string} source
 * @return {Object} 注释解析后的标记内容
 */
export function getNoteMark(note: Note, source: string) {
    // @todo: 增加hook: 取得mark前处理
    let content = note.content || '';
    if (content[0] !== '@') {
        let funcName = getFunctionName(note.nextLine);
        if (funcName) {
            const params = getFunctionParams(source, note.position + note.block.length);
            content = '@function `' + funcName + (params)+ '` ' + content;
        }
    }
    let ignore = false;
    let now_reach = 0;
    let noteMark = Object.assign({}, note, {
        source,
        index: 0,
    });
    let marks = [];
    content.replace(/(^|\n)\s*@([\w\-]*)/g, (all: string, ch: string, key: string, index: number) => {
        let start = index + all.length - 1;
        let end;
        if (start < now_reach) {
            return '';
        }
        end = content.indexOf('\n@', start);
        now_reach = end > 0 ? end : content.length;
        let value = content.substring(start + 1, now_reach);
        if (value) {
            value = value.replace(/^ */g, '');
            value = value.trimRight();
        }
        debug('mark:', key, value);
        if (key === 'index') {
            // index用来排序的
            noteMark[key] = parseInt(value, 10) || 0;
            return '';
        }
        if (key === 'ignore') {
            ignore = true;
            return '';
        }
        marks.push({
            key: key.trim(),
            value: value
        });
    });
    if (ignore) {
        return [];
    }
    return marks.map(m => Object.assign({}, m, noteMark));
}

/**
 * 将mark转换为markdown文件
 * @param marks Mark标记列表
 * @param config 配置项
 */
export function parseNoteMark(marks: any, config) {
    let markdowns = marks.map((mark, index) => {
        let template = typeof config.templates[mark.key] === 'undefined'
            ?  config.templates.default
            : config.templates[mark.key];
        let prev = marks[index - 1];
        let next = marks[index + 1];
        let result = transform(mark.key, mark.value, template, {
            key: mark.key,
            value: mark.value,
            index,
            prev: marks[index - 1],
            next: marks[index + 1],
            marks,
            config
        });
        debug('parseNoteMark:', JSON.stringify({
            key: mark.key,
            prev_key: prev ? prev.key : '',
            next_key: next ? next.key : '', 
            value: mark.value,
            index: mark.index,
            result
        }));
        return result;
    });
    return markdowns.filter(v => v).join('\n');
}

export function transform(key: string, value: string, template: string | Function, options: any) {
    if (!options) {
        options = {
            key,
            value
        }
    }
    let keys = Object.keys(options);
    let values = keys.map(attr => options[attr]);
    if (typeof template === 'function') {
        return template(key, value, options);
    }
    else if (typeof template === 'string') {
        // 计算模板中表达式值
        return template.replace(/\{([\s\S]*?)}/g, function (all, expr) {
            let func = new Function(...keys, expr.indexOf('return') >= 0 ? expr : 'return ' + expr);
            return func(...values);
        });
    }
    else {
        return '**' + key + '**\n```' + value + '\n```';
    }
}


export function code2md(source, config) {
    let notes = getNotes(source);
    let marks = notes
        .map(note => getNoteMark(note, source))
        .map(mark => parseNoteMark(mark, config));
    return marks.join('');
}

/**
 * 解析参数含义
 * @param {string} value 要转换的参数解释内容
 * @return {Parsed} 解析后的参数
 */
export function parseParam(value: string): Parsed {
    value = value.trim();
    let type = '';
    let name = '';
    let optional = false;
    let def = '';
    if (value[0] === '{') {
        type = getBracketString(value)
        value = value.substring(type.length + 2).trim();
    }
    if (value[0] === '[') {
        name = getBracketString(value, '[', ']') || value;
        optional = true;
        value = value.substring(name.length + 2).trim();
    }
    else {
        name = value.substring(0, value.indexOf(' ')) || value;
        value = value.substring(name.length + 1).trim();
    }
    if (name.indexOf('=') > 0) {
        let pos = name.indexOf('=');
        def = name.substring(pos + 1).trim();
        name = name.substring(0, pos);
    }
    return {
        type,
        name: name,
        optional,
        desc: value,
        default: def
    }
}

function getBracketString(value: String, leftFlag = '{', rightFlag = '}') {
    let bracesNumber = 0; // 左大括号个数，会被右侧大括号消灭
    let flag = 0;
    for(let i = 0; i < value.length; i++) {
        flag = i;
        switch(value[i]) {
            case leftFlag:
                bracesNumber += 1;
                break;
            case rightFlag:
                bracesNumber -= 1;
                break;
        }
        if (bracesNumber === 0) {
            break;
        }
    }
    return value.substring(1, flag);
}

/**
 * @typedef {Object} Parsed 参数解析后数据对象
 * @property {string} type 参数数据类型
 * @property {string} name 参数名称
 * @property {string} desc 参数说明
 * @property {boolean} optional 是否必填
 */
interface Parsed {
    type: string,
    name: string,
    desc: string,
    optional: boolean,
    default: string
}


/**
 * 从函数列获取函数名
 * @param {string} line 函数代码
 * @return {string} 函数名称。假如不是函数定义代码格式，则返回空字符串
 * @ignore
 */
export function getFunctionName(line: string) {
    let match = line.match(/^\s*(function)?( |^)([\w\$\.]+)\s*\(/)
    return match ? match[3] : '';
}

/**
 * 从函数列获取函数名
 * @param {string} line 函数代码
 * @return {string} 函数名称。假如不是函数定义代码格式，则返回空字符串
 * @ignore
 */
 export function getFunctionParams(source, functionStartPosition) {
  let start = source.indexOf('(', functionStartPosition + 2);
  console.log('getFunctionParams:', functionStartPosition, start);
  if (start > 0) {
    let end = source.indexOf(')', start);
    if (end > 0) {
      return source.substring(start, end + 1).trim().replace(/\n/, ' ');
    }
  }
  return '';
}