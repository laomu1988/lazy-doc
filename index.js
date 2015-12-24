var observable = require('observablejs');
/*start*/
// 配置内容
var default_config = {
    // 设置自动转换词汇，需要以@开始。例如@param 将被转换为'参数'
    keys: {
        'author': '作者',
        'description': '详细描述',
        'detail': '细节',
        'params': '参数列表',
        'param': '参数',
        'property': '属性',
        'prototype': '原型',
        'return': '返回值'
    },
    keep: false,// 是否保留非注释部分
    scopes: [
        {
            start: '/**@',
            end: '*/'
        },
        {
            start: '<!--@',
            end: '-->'
        }
    ],
    setTitle: function (title) {
        return title ? '## ' + title : '';
    },
    setDetail: function (detail) {
        return detail ? '```\n' + detail + '\n```\n' : '';
    }
};
/*end*/

function compile(source, _config) {
    return compile.compile(source, _config);
}
observable(compile);

compile.config = default_config;

/** 扩展属性，将from对象上的属性全部赋值给target（浅复制）
 * @target: 增加属性到哪个对象
 * @form: 从哪个对象读取属性
 **/
compile.extend = function (target, from) {
    if (!target) {
        return from;
    }
    for (var i in from) {
        if (typeof target[i] == 'undefined') {
            target[i] = from[i];
        }
    }
    return target;
};


/** 编译文件*/
compile.compile = function (source, config) {
    // console.log('compile.compile');
    if (!source) {
        console.log('source 内容为空！');
        return '';
    }
    config = compile.extend(config, default_config);
    //console.log(config);
    var scopes = config.scopes;
    if (!source || !scopes || scopes.length == 0) {
        return '';
    }
    var reg = scopesReg(scopes);
    console.log(reg);
    var len = scopes.length;
    //start 编译时使用到的临时对象
    var data = {
        content: source, // 要拆分的内容
        scope: null, // 正在解析的边界设置
        config: config, //配置文件
        block: '', //注释中要解析内容
        start: 0, // 注释内容开始位置
        end: 0, //注释内容结束位置
        nextLine: '', // 下一行内容
        title: '', // 解析后块内容标题
        detail: '', // 解析后的块内容
        out: '' // 解析后输出内容
    };//end

    var out = '';
    var result = source.replace(reg, function () {
        for (var i = 1; i <= len; i++) {
            if (arguments[i]) {
                data.scope = scopes[i - 1];
                data.block = arguments[i];
                data.start = arguments[len + 1];
                data.end = data.start + data.scope.start.length + data.scope.end.length + data.block.length;
                data.nextLine = compile.getNextLine(source, data.end);
                data.title = '';
                data.detail = '';
                data.out = '';
                //start 编译某段注释块之前触发before_analysis事件
                compile.trigger('before_analysis', data);//end
                compile.analysis(data);
                data.out += (data.title ? data.title + '\n' : '') + (data.detail ? data.detail + '\n' : '');
                //start 编译某段注释块之后触发analysis事件
                compile.trigger('analysis', data); //end

                out += data.out;
                return data.out;
            }
        }
    });

    return config.keep ? result : out;
};
function str2reg(str) {
    return str.replace(/([\\\*\/\+\?\(\)\[\]\!\%\$\^])/g, '\\$1');
}

function scopesReg(scopes) {
    if (!scopes || scopes.length == 0) {
        return null;
    }
    var str = '';
    for (var i = 0; i < scopes.length; i++) {
        var scope = scopes[i];

        str += (str ? '|' : '') + str2reg(scope.start) + '([\\w\\W]*?)' + str2reg(scope.end);
    }
    return new RegExp(str, 'g');
}


/**解析注释内容（可以更改此函数修改替换规则）*/
compile.analysis = function (data) {
    if (!data.block) {
        return '';
    }
    var config = data.config;
    var lines = data.block.split('\n');
    if (lines[0] && !lines[0].trim()) {
        lines.shift();
    }
    if (lines[0] && lines[0].trim()) {
        if (!lines[0].match(/^[\s\r\n]*@/)) {
            data.title = lines.shift();
        }
    } else {
        lines.shift();
    }

    if (data.nextLine && data.nextLine.indexOf('function') >= 0) {
        data.nextLine = data.nextLine.replace(/\=?\s*function/, '');
        data.nextLine = data.nextLine.replace(/\{\s*$/, '');
        data.title = data.nextLine.trim() + ' ' + data.title;
    }

    // 替换@属性词
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].replace(/^\s*\*|\s*$/g, '');
        var match = line.match(/\s*@(\w+)/);
        // console.log('matchs', match);
        if (match && config.keys[match[1]]) {
            line = line.replace('@' + match[1], config.keys[match[1]]);
        }
        if (!line) {
            lines.splice(i, 1);
            i -= 1;
            continue;
        }
        // console.log('outl', line);
        lines[i] = line;
    }
    // todo：删除前面空格
    var code = lines.join('\n');
    data.detail = code;
    if (data.config && data.config.setTitle) {
        data.title = data.config.setTitle(data.title);
    }
    if (data.config && data.config.setDetail) {
        data.detail = data.config.setDetail(data.detail);
    }
    return data;
};

/** 取得注释块结束后的下一行内容，用来补充注释块内容，比如函数名等 */
compile.getNextLine = function (source, nowPlace) {
    var str = source.substring(nowPlace);
    var start = str.indexOf('\n');
    var str1 = str.substring(0, start).trim();
    if (str1) {
        return str1;
    } else {
        return str.substring(start + 1, str.indexOf('\n', start + 1)).trim();
    }
    return '';
};


module.exports = compile;