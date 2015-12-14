# 懒人文档生成工具
* 根据注释自动生成文档
* 设置注释开始标志和结束标志，和常用注释区分开
* 自动读取注释后函数
* todo自动读取变量名
* todo 设置文档或变量范围
* 引用一个文件夹
* todo 引用某一个文件上的文档
* todo 引用某一个文件中的一部分
* 生成md文档
* 添加目录链接
* todo 生成html文档（带目录结构）

## 示例
### 生成md文档
```


```
### 参数
```
```
### 引用
```
```


## compile.compile  (source, config) 编译文件

## 默认配置*/
```
var default_config = {
    // 设置自动转换词汇，需要以@开始。参数 将被转换为'参数'
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
```



