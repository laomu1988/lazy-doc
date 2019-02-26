#! /usr/bin/env node

/**
 * @file 命令行工具
 * @author laomu1988
 */
/* eslint-disable fecs-camelcase */
/**
 * @raw ## 命令行工具使用
 * ```sh
 * # 需要先全局安装lazy-doc，`npm install -g lazy-doc`
 * lazydoc <path|folder> -o dest_file --config config_path
 * lazydoc readme.md
 * lazydoc filename -o dest_filename
 * # 使用文件夹和配置项
 * lazydoc folder --config doc.config.js
 * # 使用glob规则匹配文件
 * lazydoc "src/*.{ts|js}" -o test.md
 * ```
 */
const Path = require('path');
const pkg = require('../package.json');
const program = require('commander');
const doc = require('../lib/index');
const cwd = process.cwd();

program
    .version(pkg.version, '-v, --version')
    .usage('<path>')
    .option('-o, --output <output>', '输出路径，可以是文件或者文件夹')
    .option('--config <config_path>', '配置文件路径')
    .action(function (path, options = {}) {
        let config = {};
        if (options.config) {
            let config_path = Path.resolve(cwd, options.config);
            config = require(config_path);
            console.log('read config', config_path, config);
        }
        if (typeof path !== 'string') {
            throw new Error('"lazydoc <path>" path need to be string');
        }
        if (options.output) {
            console.log('output_path', options.output);
        }
        console.log('doc:', {path, output: options.output, config});
        doc(path, options.output || '', config);
        console.log('finish lazy-doc:', path);
    });

program.parse(process.argv);
