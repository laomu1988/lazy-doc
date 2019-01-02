/**
 * @file 注释及生成内容配置项
 * */
var config = {
    'default': function (key, val) {
        var trim = val.trim();
        if (trim) {
            return '**' + key + '**\n\n```' + val + '\n```\n';
        }
        else {
            return '**' + key + '**\n';
        }
    }, // 默认规则
    'constructs': '# {val}\n',
    'namespace': '# {val}\n',
    'class': '# 类 {val}\n',
    'module': '## 模块 {val}\n',
    'object': '## 对象 {val}\n',
    'function': '### {val}\n',
    'var': '#### {val} ',
    'variable': '#### 变量 {val}',
    'author': '作者 {val}',
    'description': '{val}',
    'desc': '{val}',
    'detail': '细节 {val}',
    'params': '参数列表\n```{val}\n```',
    'param': function (key, val, index, all) {
        // 第一个param之前和最后一个param之后都增加换行符
        var notes = all.notes;
        var before = notes[index - 1];
        var next = notes[index + 1];
        return (!before || before.key !== key ? '\n' : '') + '* ' + val + (!next || next.key !== key ? '\n' : '');
    },
    'extends': '继承自 {val}',
    'property': '属性 {val}',
    'prototype': '原型 {val}',
    'return': '返回值 {val}',
    'returns': '返回列表\n{val}',
    'index': '', // 排序使用,越大越靠前

    'example': function (key, val) {
        // @example标签之后未换行内容将作为标题后内容展示
        var place = val.indexOf('\n');
        place = place >= 0 ? place : val.length;
        var title = val.substr(0, place);
        val = val.substr(place + 1);
        return '\n**示例:**' + title + '\n' + (val.trim() ? '\n```\n' + val + '\n```\n' : '');
    }
};

module.exports = config;
