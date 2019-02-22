


###  lazy-doc 懒人文档生成工具
*  {string} folder 要生成文档的代码所在文件夹
         例如: __dirname + '/src'
*  {string|Function} output
       当为string时，表示要写入的文件路径
       当为Function时，文档计算完毕后的回调,有两个参数,所有文档合并后的string和分析后的文档列表
*  {object} options 配置项。配置@标记后的输出规则,包含两个参数key和val,当时字符串时自动替换{key}和{value}为文档值,是函数时将被替换为返回内容. 可参考https://github.com/laomu1988/lazy-doc/blob/master/src/template.ts

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
     default: '### {key}\n{value}', // 修改默认规则
     source: '### 源代码地址: {value}'  // 自己制定规则
});
```

# Todo

* [ ] 生成数据数组
* [ ] Markdown内部配置后自更新
* [ ] 函数参数改为表格输出 

# 更新记录

* [修改记录](https://github.com/laomu1988/lazy-doc/blob/master/package.json) 


## 书写规范
* 注释以/**开头,并以*/结尾.并且其中包含以@开头的说明
* @标记只能出现在行的开头(之前可以加一个*),行中间的@标记将不被作为格式标记处理
* 一个注释内的第一个@标记后面将表示该注释模块的类型,例如 函数,模块,变量等