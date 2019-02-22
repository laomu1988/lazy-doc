import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from "constants";

/**
 * @file 公共函数
 */

/**
 * 从函数列获取函数名
 * @param {string} line 函数代码
 * @return {string} 函数名称。假如不是函数定义代码格式，则返回空字符串
 */
export function getFunctionName(line: string) {
    let match = line.match(/^([^/]*)(function\s+)?\b(\w+)\s*\(/)
    return match ? match[3] : '';
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
        content = content.replace(/\n ?\* ?/g, '\n').trim();
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
    console.log('list:', JSON.stringify(list));
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
    let content = note.content || '';
    if (content[0] !== '@') {
        let funcName = getFunctionName(note.nextLine);
        if (funcName) {
            content = '@function ' + funcName + ' ';
        }
    }
    let now_reach = 0;
    let noteMark = Object.assign({}, note, {
        source,
        desc: content.substring(0, content.indexOf('@')).trim(),
        firstKey: '',
        firstValue: '',
        index: 0,
        marks: []
    });
    content.replace(/(^|\n)\s*@([\w\-]*)/g, (all: string, ch: string, key: string, index: number) => {
        let start = index + all.length - 1;
        let end;
        if (start < now_reach || key === 'raw-end') {
            // @raw-end还未结束
            return '';
        }

        if (key === 'raw') {
            end = content.indexOf('\n@raw-end', start);
        }
        else {
            end = content.indexOf('\n@', start);
        }
        now_reach = end > 0 ? end : content.length;
        let value = content.substring(start + 1, now_reach);
        if (value) {
            value = value.trimRight();
        }

        // console.log('key:', key, value, '\n---------');

        if (key === 'index') {
            // index 是用来排序的
            noteMark.index = parseInt(value, 10) || 0;
            return '';
        }

        let isFirst = false;
        if (!noteMark.firstKey) {
            noteMark.firstKey = key.trim();
            if (value && value.length > 0) {
                noteMark.firstValue = value;
            }
            isFirst = true;
        }

        noteMark.marks.push({key: key.trim(), value: value});
        if (isFirst && index > 0) {
            let desc = content.substr(0, index).trimRight();
            if (desc) {
                noteMark.marks.push({key: 'desc', value: desc});
            }
        }
    });
    return noteMark;
}

/**
 * 将mark转换为markdown文件
 * @param 
 * @param options 配置项
 */
export function parseNoteMark(noteMark: any, config) {
    let markdowns = noteMark.marks.map((mark, index) => {
        let template = typeof config.templates[mark.key] === 'undefined'
            ?  config.templates.default
            : config.templates[mark.key];
        return transform(mark.key, mark.value, template, {
            key: mark.key,
            value: mark.value,
            index,
            prev: noteMark[index - 1],
            next: noteMark[index + 1],
            noteMark,
            config
        }) + '\n';
    });
    return markdowns.join('');
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