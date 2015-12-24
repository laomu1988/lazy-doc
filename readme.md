## // 配置内容
```
var default_config = {
    // 设置自动转换词汇，需要以@开始。例如参数 将被转换为'参数'
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
```

## compile.extend  (target, from)  扩展属性，将from对象上的属性全部赋值给target（浅复制）
```
 @target: 增加属性到哪个对象
 @form: 从哪个对象读取属性
```

## compile.compile  (source, config)  编译文件
##  编译时使用到的临时对象
```
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
    };
```

##  编译某段注释块之前触发before_analysis事件
```
                compile.trigger('before_analysis', data);
```

##  编译某段注释块之后触发analysis事件
```
                compile.trigger('analysis', data);
```

## compile.analysis  (data) 解析注释内容（可以更改此函数修改替换规则）
## compile.getNextLine  (source, nowPlace)  取得注释块结束后的下一行内容，用来补充注释块内容，比如函数名等 
