/**
 *
 *
 * */
var config = {
    modules: [
        'constructs',
        'object',
        'namespace',
        'module',
        'class',
        'function',
        'var',
        'variable'
    ],
    Template: {
        'constructs': '# {val}',
        'namespace': '# {val}',
        'class': '#类 {val}',
        'module': '##模块 {val}',
        'object': '##对象 {val}',
        'function': '### {val} ',
        'var': '### {val} ',
        'variable': '###变量 {val}',
        'author': '作者 {val}',
        'description': '{val}',
        'desc': '{val}',
        'detail': '细节 {val}',
        'params': '参数列表\n```{val}\n```',
        'param': '*{val}',
        'extends': '继承自{val}',
        'property': '属性 {val}',
        'prototype': '原型 {val}',
        'return': '返回值 {val}',
        'returns': '返回列表\n{val}',
        'example': '```\n{val}```',
        'index': ''
    }
};

module.exports = config;