# 简单的文档生成工具
* 根据代码注释生成文档
* 根据markdown中注释替换文件

<!--@doc src/index.ts-->

###  lazy-doc 懒人文档生成工具
| 参数 | 说明 | 类型 |
| --- | --- | --- |
| folder | 要生成文档的代码所在文件夹          例如: __dirname + '/src' | string |
| output | 输出位置。        当为string时，表示要写入的文件路径        当为Function时，文档计算完毕后的回调,有两个参数,所有文档合并后的string和分析后的文档列表 | string|Function |
| options | 配置项。配置@标记后的输出规则,包含两个参数key和val,当时字符串时自动替换{key}和{value}为文档值,是函数时将被替换为返回内容. 可参考https://github.com/laomu1988/lazy-doc/blob/master/src/template.ts | object |


**install**
```
npm install lazy-doc
```

**usage**
```
var doc = require('lazy-doc');
doc(folder, output, config);
```

**示例**
```
var doc = require('lazy-doc');
doc(__dirname + '/src', __dirname + '/readme.md',{
     default: '### {key}\n{value}', // 修改默认规则
     source: '### 源代码地址: {value}'  // 自己制定规则
});
```

<!--@end-->
<!--@doc bin/lazydoc.js-->
## 命令行工具使用
```sh
# 需要先全局安装lazy-doc，`npm install -g lazy-doc`
lazydoc <path|folder> -o dest_file --config config_path
lazydoc readme.md
lazydoc filename -o dest_filename
# 使用文件夹和配置项
lazydoc folder --config doc.config.js
# 使用glob规则匹配文件
lazydoc "src/*.{ts|js}" -o test.md
```
<!--@end-->

<!--@doc src/config.ts-->

## 配置项说明

### ignoreExt 忽略的文件扩展名,数组格式
默认为['.bmp', '.jpg', '.gif', '.png']

### templates 模板配置
例如
```
{
   'class': '\n# 类 {value.trim()}',
}
```

###  beforeParse 转换文件前触发
| 参数 | 说明 | 类型 |
| --- | --- | --- |
| ctx | 写入文件信息 | Object |
| ctx | .filepath 要转换的文件的路径 | string |
| ctx | .origin 文件内容 | string |


###  beforeWrite 写入文件前调用
| 参数 | 说明 | 类型 |
| --- | --- | --- |
| ctx | 写入文件信息 | Object |
| ctx | .filepath 要写入的路径 | string |
| ctx | .content 文件内容 | string |

<!--@end-->

## 更新记录 (https://github.com/laomu1988/lazy-doc/blob/master/package.json) 

## lib/utils 函数
<!--@doc src/utils.ts-->

###  getMarks 从代码中查找注释模块并取得`@`标记
| 参数 | 说明 | 类型 |
| --- | --- | --- |
| source | 源文件 |  |

返回值  {[Mark]} 标记列表 

###  getNotes 取得代码中的块注释内容并清理掉前面的*
| 参数 | 说明 | 类型 |
| --- | --- | --- |
| source | 代码内容 | string |

返回值  {[Note]} 注释内容 

##  {Object} Note 解析后注释内容结构
| 属性 | 说明 | 类型 |
| --- | --- | --- |
| block | 注释原文 | string |
| content | 注释内容(清理掉前面的*后剩余部分) | string |
| position | 注释开始位置 | number |
| nextLine | 注释结束后后面一行内容（注释结束后不是换行符，则直接取注释后内容） | string |


###  getNoteMark 取得注释中用mark标记的代码
| 参数 | 说明 | 类型 |
| --- | --- | --- |
| note |  | Object |
| source |  | string |

返回值  {Object} 注释解析后的标记内容 

###  parseNoteMark 将mark转换为markdown文件
| 参数 | 说明 | 类型 |
| --- | --- | --- |
| marks | Mark标记列表 |  |
| config | 配置项 |  |


###  parseParam 解析参数含义
| 参数 | 说明 | 类型 |
| --- | --- | --- |
| value | 要转换的参数解释内容 | string |

返回值  {Parsed} 解析后的参数 

##  {Object} Parsed 参数解析后数据对象
| 属性 | 说明 | 类型 |
| --- | --- | --- |
| type | 参数数据类型 | string |
| name | 参数名称 | string |
| desc | 参数说明 | string |
| optional | 是否必填 | boolean |

<!--@end-->

## 书写规范
* 注释以`/**`开头,并以`*/`结尾.并且其中包含以@开头的说明
* @标记只能出现在行的开头(之前可以加一个*),行中间的@标记将不被作为格式标记处理
* 一个注释内的第一个@标记后面将表示该注释模块的类型,例如 函数,模块,变量等

## Todo
* [ ] 重新梳理数据和阶段
  - 阶段及事件
    - 读取
    - 转换mark(mark, {markIndex, prevMark, nextMark, fileInfo})
    - 排序并写入文件
  - 数据结构 []
      - file: '' 文件路径
      - content: '' 文件内容
      - dest: '',  写入文件路径
      - blocks
        - type: 类型 code代码,note注释
        - content: 内容
        - position: 开始位置
        - marks: [] 内部注释列表
          - origin: ''
          - name: ''
          - position 注释在content中的位置
          - translate: {}
          - result
* [ ] 使用ast转换??