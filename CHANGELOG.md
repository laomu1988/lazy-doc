# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.5](https://github.com/laomu1988/lazy-doc/compare/v0.2.4...v0.2.5) (2019-02-28)


### Bug Fixes

* 复杂函数参数类型解析错误修复；注释前带空格修复 ([576c81b](https://github.com/laomu1988/lazy-doc/commit/576c81b))


### Features

* 增加转换前处理配置(beforeParse) ([3e64bae](https://github.com/laomu1988/lazy-doc/commit/3e64bae))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.4](https://github.com/laomu1988/lazy-doc/compare/v0.2.3...v0.2.4) (2019-02-27)


### Features

* 增加beforeWrite配置项 ([ad9fe4c](https://github.com/laomu1988/lazy-doc/commit/ad9fe4c))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.3](https://github.com/laomu1988/lazy-doc/compare/v0.2.2...v0.2.3) (2019-02-26)


### Bug Fixes

* markdown文件未改变时，不重新写入文件 ([4e9f147](https://github.com/laomu1988/lazy-doc/commit/4e9f147))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.2](https://github.com/laomu1988/lazy-doc/compare/v0.2.1...v0.2.2) (2019-02-26)


### Features

* 命令行增加读取配置项文件配置 ([bbf3030](https://github.com/laomu1988/lazy-doc/commit/bbf3030))
* 文件路径可按照glob规则匹配；增加文件扩展名过滤配置项 ([2a66cf6](https://github.com/laomu1988/lazy-doc/commit/2a66cf6))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.1](https://github.com/laomu1988/lazy-doc/compare/v0.2.0...v0.2.1) (2019-02-25)


### Bug Fixes

* 删除多余空行 ([9474504](https://github.com/laomu1988/lazy-doc/commit/9474504))
* 测试程序完善; 修复输出到文件夹；避免分隔同一个文件内标记 ([f1736b9](https://github.com/laomu1988/lazy-doc/commit/f1736b9))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [0.2.0](https://github.com/laomu1988/lazy-doc/compare/v0.1.8...v0.2.0) (2019-02-22)


### Features

* 删除[@raw](https://github.com/raw)和[@raw-end](https://github.com/raw-end) ([94d893d](https://github.com/laomu1988/lazy-doc/commit/94d893d))
* 参数param和属性property输出为表格格式 ([f9ade4c](https://github.com/laomu1988/lazy-doc/commit/f9ade4c))
* 增加命令行工具 ([ff9b57e](https://github.com/laomu1988/lazy-doc/commit/ff9b57e))
* 清理多余的空行 ([bc36b3a](https://github.com/laomu1988/lazy-doc/commit/bc36b3a))
* 直接读取markdown文件并根据其中注释更新其内容 ([29f947a](https://github.com/laomu1988/lazy-doc/commit/29f947a))

## 0.1.8 (2019-02-21)
* 增加ChangeLog

## 0.1.7
* 使用示例修改

## 2016.08.17
* 增加回调函数; 可以直接输出文件列表(输出到目录);

## 2016.08.15
* 第一个@param之前和最后一个@param之后增加换行

## 2016.08.13

* 标记符号@必须放在行的开头才能起作用,避免页内冲突
* 增加@raw和@raw-end,不转换标签中的内容

## 2016.08.12
* 自动检查版本更新并提示

## 2016.08.11
* 修改index排序规则,index越大排在前面