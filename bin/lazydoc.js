#! /usr/bin/env node

/**
 * @file 命令行工具
 * @author laomu1988
 */

/**
 * @raw ## 命令行工具使用
 * ```sh
 * # 需要先全局安装lazy-doc，`npm install -g lazy-doc`
 * lazydoc readme.md
 * lazydoc filename -o dest_filename
 * ```
 */
const pkg = require('../package.json');
const program = require('commander');
const doc = require('../lib/index');

program
    .version(pkg.version, '-v, --version')
    .usage('<path>')
    .option('-o, --output <output>', '输出路径，可以是文件或者文件夹')
    .action(function (path, options = {}) {
        doc(path, options.output, {output: options.output});
        console.log('finish lazy-doc:', path);
    });

program.parse(process.argv);
