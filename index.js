/**start默认配置*/
var default_config = {
    // 设置自动转换词汇，需要以@开始。@param 将被转换为'参数'
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
        },
        {
            start: '/**start',
            end: '/*end' + '*/' //避免被结束符号替换掉
        }
    ]
};
/*end*/

/**扩展属性*/
compile.extend = function (target, property) {
    if (!target) {
        return property;
    }
    for (var i in property) {
        if (typeof target[i] == 'undefined') {
            target[i] = property[i];
        }
    }
    return target;
}

/**解析注释内容*/
function analysis(code, nextLine, config) {
    console.log('anilysis', code);
    console.log('nextLine', nextLine);
    var lines = code.trim().split('\n');
    var title = '';
    if (lines[0].match(/^[\s\r\n]*\$/)) {
        return analysisMethod(code, nextLine, config);
    }

    if (!lines[0].match(/^[\s\r\n]*@/)) {
        title = lines.shift();
    }
    if (nextLine && nextLine.indexOf('function') >= 0) {
        nextLine = nextLine.replace(/\=?\s*function/, '');
        nextLine = nextLine.replace(/\{\s*$/, '');
        title = nextLine.trim() + ' ' + title;
    }
    title = '## ' + title;

    // 替换@属性词
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].replace(/^\s*\*/, '');
        console.log('line', line);
        var match = line.match(/\s*@(\w+)/);
        console.log('matchs', match);
        if (match && config.keys[match[1]]) {
            line = line.replace('@' + match[1], config.keys[match[1]]);
        }
        console.log('outl', line);
        lines[i] = line;
    }
    // todo：删除前面空格
    var code = lines.join('\n');
    if (code) {
        code = '```\n' + code + '\n```\n';
        return title + '\n' + code;
    }
    return title + '\n';
}

/**分析执行函数参数*/
function analysisMethod(code, nextLine, config) {
    console.log('analysisMethod', code);
    var funcName;
    code = code.replace(/\s*\$(\w+)/, function (a, b) {
        funcName = b;
        return '';
    });
    var func = compile.methods[funcName];
    if (!func) {
        return '/** 未知操作：' + funcName + '*/';
    }
    var argus = code.trim().split('\n');
    if (argus.length == 0 && code.trim().indexOf(' ') < 0) {
        return func(code.trim(), config);
    }
    var out = {};
    for (var i = 0; i < argus.length; i++) {
        var attrs = argus[i].trim().split(/\s+/);
        if (attrs[0]) {
            out[attrs[0]] = attrs[1] || '';
        }
    }
    return func(out, config);
}

function compile(source, _config) {
    return compile.compile(source, _config);
}

/**@编译文件*/
compile.compile = function (source, config) {
    console.log('compile.compile');
    if (!source) {
        console.log('source 内容为空！');
        return '';
    }
    config = compile.extend(config, default_config);
    //console.log(config);
    var scopes = config.scopes;
    var out = '';
    if (scopes) {
        for (var i = 0; i < scopes.length; i++) {
            out += compile.compileScope(source, scopes[i], config);
            if (config.keep) {
                source = out;
                out = '';
            }
        }
    }
    return config.keep ? source : out;
};

compile.compileScope = function (source, scope, config) {
    if (!scope || !scope.start || !scope.end) {
        consoe.log('compile.compileScope need scope data..{start,end}')
        return '';
    }
    function getStartPlace(from) {
        //console.log('getStartPlace', from);
        var start = source.indexOf(scope.start, from);
        if (start < 0) {
            return -1;
        }
        var lineBefore = source.substring(source.lastIndexOf('\n', start), start);
        if (lineBefore) {
            lineBefore = lineBefore.trim();
            if (lineBefore) {
                //console.log('lineBefore:', lineBefore);
                //注释开始没有另起一行
                return getStartPlace(start + scope.start.length);
            }
        }
        return start;
    }

    var start = getStartPlace(0), end = 0, lastEnd = 0;
    var out = '';
    // console.log('start', start);
    while (start >= 0) {
        if (config.keep) {
            out += source.substring(lastEnd, start);
        }
        end = source.indexOf(scope.end, start + scope.start.length);
        var nextLineStart = source.indexOf('\n', end + scope.end.length);
        nextLine = nextLineStart > 0 ? source.substring(nextLineStart + 1, source.indexOf('\n', nextLineStart + 1)).trim() : '';

        out += analysis(source.substring(start + scope.start.length, end).trim(), nextLine, config) + '\n';
        //console.log('compileScope', start, end);
        start = getStartPlace(end + scope.end.length);

        lastEnd = end + scope.end.length;
        //console.log('lastEnd:', lastEnd);
    }
    if (config.keep) {
        out += source.substring(lastEnd);
    }
    //console.log('out', out);
    return out;
};

var fs = require('fs');
compile.methods = {
    /**引用文件*/
    file: function (args, config) {
        if (!args) {
            return '';
        }
        console.log(args);
        var src = typeof args === 'string' ? args : args.src;
        console.log('methods file: ', src);
        if (src.config) {
            try {
                src.config = JSON.parse(src.config);
            } catch (e) {
                console.log('file方法config设置错误,请使用json格式！');
            }
        }
        return compile.compile(fs.readFileSync(src, 'utf8'), src.config);
    },
    // 引用一部分
    part: function (code) {

    },
    folder: function () {

    }
};


module.exports = compile;