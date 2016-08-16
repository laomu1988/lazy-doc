###  lazy-doc

# 懒人文档生成工具
书写js代码,自动生成markdown文档
js代码格式参考test/src/index.js

*  {string} folder 要生成文档的代码所在文件夹
*  {string} output 要写入的文件路径
*  {object} config 文件配置,可参考src/config.json

**install**

```
npm install lazy-doc
```

**uaeage**

```
var doc = require('lazy-doc');
doc(folder,output);
```

**todo**

**history**

```
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