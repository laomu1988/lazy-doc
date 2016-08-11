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
        'constructs': '# {val}\n',
        'namespace': '# {val}\n',
        'class': '# 类 {val}\n',
        'module': '## 模块 {val}\n',
        'object': '## 对象 {val}\n',
        'function': '### {val}\n',
        'var': '### {val} ',
        'variable': '### 变量 {val}',
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
        'example': '\n**示例:**\n\n```{val}\n```',
        'index': '' // 排序使用,越大越靠前
    }
};

module.exports = config;