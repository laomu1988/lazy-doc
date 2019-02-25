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
 * lazydoc folder --config doc.config.js
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
        doc(path, options.output, Object.assign({}, config, {output: options.output}));
        console.log('finish lazy-doc:', path);
    });

program.parse(process.argv);
