###  lazy-doc

# 懒人文档生成工具
 书写js代码,自动生成markdown文档
 js代码格式参考test/src/index.js
* {string} folder 要生成文档的代码所在文件夹
* {string} output 要写入的文件路径
* {object} config 文件配置,可参考src/config.json
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
```
 - 标记必须放在行的开头才能起作用,避免页内冲突
```
**history**
```
 - 2016.08.11 修改index排序规则,index越大排在前面
```
