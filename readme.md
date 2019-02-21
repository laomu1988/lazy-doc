###  lazy-doc

# 懒人文档生成工具
书写js代码,自动生成markdown文档
js代码格式参考test/src/index.js

*  {string} folder 要生成文档的代码所在文件夹
         例如: __dirname + '/src'
*  {string|Function} output
       当为string时，表示要写入的文件路径
       当为Function时，文档计算完毕后的回调,有两个参数,所有文档合并后的string和分析后的文档列表
*  {object} config 配置@标记后的输出规则,包含两个参数key和val,当时字符串时自动替换{key}和{val}为文档值,是函数时将被替换为返回内容. 可参考src/config.json

**install**

```
npm install lazy-doc
```

**usage**

```
var doc = require('lazy-doc');
doc(folder, output, config);
```


**示例:**

```
var doc = require('lazy-doc');
doc(__dirname + '/src', __dirname + '/readme.md',{
     default: '### {key}\n{val}', // 修改默认规则
     source: '### 源代码地址: {val}'  // 自己制定规则
});
```

**todo**

**history**

```
- v0.1.7
    * 使用示例修改
- 2016.08.17
    * 增加回调函数; 可以直接输出文件列表(输出到目录);
- 2016.08.15
    * 第一个@param之前和最后一个@param之后增加换行
- 2016.08.13
    * 标记符号@必须放在行的开头才能起作用,避免页内冲突
    * 增加@raw和@raw-end,不转换标签中的内容
- 2016.08.12 自动检查版本更新并提示
- 2016.08.11 修改index排序规则,index越大排在前面
```











## 书写规范
* 注释以/**开头,并以*/结尾.并且其中包含以@开头的说明
* @标记只能出现在行的开头(之前可以加一个*),行中间的@标记将不被作为格式标记处理
* 一个注释内的第一个@标记后面将表示该注释模块的类型,例如 函数,模块,变量等