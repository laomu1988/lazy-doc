/**
 * @file 注释及生成内容配置项
 * @h2 配置项说明
 * */
import * as utils from './utils';

/**
 * @h3 ignoreExt 忽略的文件扩展名,数组格式
 * 默认为['.bmp', '.jpg', '.gif', '.png']
 **/
export const ignoreExt = [
    '.bmp',
    '.jpg',
    '.gif',
    '.png'
]

/**
 * @h3 templates 模板配置
 * 例如
 * ```
 * {
 *    'class': '\n# 类 {value.trim()}',
 * }
 * ```
 */
export const templates = {
    'default': function (key, value = '') {
        var trim = (value + '').trim();
        if (trim) {
            return '\n**' + key + '**\n```\n' + value.trim() + '\n```';
        }
        else {
            return '\n**' + key + '**';
        }
    }, // 默认规则
    'h1': '\n# {value.trim()}',
    'h2': '\n## {value.trim()}',
    'h3': '\n### {value.trim()}',
    'h4': '\n#### {value.trim()}',
    'constructs': '\n# {value}',
    'namespace': '\n# {value}',
    'class': '\n# 类 {value}',
    'module': '\n## 模块 {value}',
    'object': '\n## 对象 {value}',
    'file': '',
    'typedef': '\n## {value}',
    'function': '\n### {value}',
    'var': '#### {value}  ',
    'variable': '#### 变量 {value} ',
    'author': '',
    'description': '{value}',
    'desc': '{value}',
    'detail': '**细节** {value} ',
    'params': '**参数列表**\n```\n{value}\n```',
    // 使用列表展示参数
    'param': tableParams,
    'extends': '继承自 {value} ',
    'property': (key, value, options) => tableParams(key, value, options, '属性'),
    'prototype': '原型 {value} ',
    'return': '返回值 {value} ',
    'returns': '返回列表\n{value} ',
    'history': '\n# 更新记录\n{value} ',
    'raw': '{value.trim()}',
    'todo': '# Todo{value} ',
    'index': '', // 排序使用,越大越靠前

    'example': function (key, value) {
        // @example标签之后未换行内容将作为标题后内容展示
        var place = value.indexOf('\n');
        place = place >= 0 ? place : value.length;
        var title = value.substr(0, place);
        value = value.substr(place + 1);
        return '\n**示例**' + title.trim() + '\n' + (value.trim() ? '```\n' + value + '\n```\n' : '');
    }
};

// 使用列表展示参数
function tableParams(key: string, value: string, options: any, typeName = '参数') {
    let prev = options.prev;
    let next = options.next;
    let parsed = utils.parseParam(value);
    let result = '';
    if (!prev || prev.key !== key) {
        result += `| ${typeName} | 说明 | 类型 |\n| --- | --- | --- |\n`;
    }
    result += `| ${parsed.name} | ${parsed.desc.replace(/\n/g, ' ')} | ${parsed.type} |`;
    if (!next || next.key !== key) {
        result += '\n'
    }
    return result;
}

/**
 * 转换文件前触发
 * @param {Object} ctx 写入文件信息
 * @param {string} ctx.filepath 要转换的文件的路径
 * @param {string} ctx.origin 文件内容
 */
export function beforeParse(ctx: {filepath: string, origin: string}){
}

/**
 * 写入文件前调用
 * @param {Object} ctx 写入文件信息
 * @param {string} ctx.filepath 要写入的路径
 * @param {string} ctx.content 文件内容
 */
export function beforeWrite(ctx: {filepath: string, content: string}){
    console.log('write file:', ctx.filepath);
}
