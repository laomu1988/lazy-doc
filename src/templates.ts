/**
 * @file 注释及生成内容配置项
 * */
export default {
    'default': function (key, value = '') {
        var trim = (value + '').trim();
        if (trim) {
            return '\n**' + key + '**\n```\n' + value.trim() + '\n```';
        }
        else {
            return '\n**' + key + '**';
        }
    }, // 默认规则
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
    'author': '**作者** {value} ',
    'description': '{value}',
    'desc': '{value}',
    'detail': '**细节** {value} ',
    'params': '**参数列表**\n```\n{value}\n```',
    'param': function (key, value, options) {
        // 第一个param之前和最后一个param之后都增加换行符
        var prev = options.prev;
        var next = options.next;
        return (!prev || prev.key !== key ? '' : '') + '* ' + value + (!next || next.key !== key ? '' : '');
    },
    'extends': '继承自 {value} ',
    'property': '属性 {value} ',
    'prototype': '原型 {value} ',
    'return': '返回值 {value} ',
    'returns': '返回列表\n{value} ',
    'history': '\n# 更新记录\n{value} ',
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
