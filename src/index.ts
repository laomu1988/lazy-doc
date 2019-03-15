/**
 * @file 懒人文档生成工具
 * 书写js代码,自动生成markdown文档
 * js代码格式参考test/src/index.js
 **/

/**
 * @function lazy-doc 懒人文档生成工具
 * @param {string} folder 要生成文档的代码所在文件夹
 *          例如: __dirname + '/src'
 * @param {string|Function} [output] 输出位置。
 *        当为string时，表示要写入的文件路径
 *        当为Function时，文档计算完毕后的回调,有两个参数,所有文档合并后的string和分析后的文档列表
 * @param {object} [options] 配置项。配置@标记后的输出规则,包含两个参数key和val,当时字符串时自动替换{key}和{value}为文档值,是函数时将被替换为返回内容. 可参考https://github.com/laomu1988/lazy-doc/blob/master/src/template.ts
 *
 * @install
 * npm install lazy-doc
 *
 * @usage
 * var doc = require('lazy-doc');
 * doc(folder, output, config);
 *
 * @example
 * var doc = require('lazy-doc');
 * doc(__dirname + '/src', __dirname + '/readme.md',{
 *      default: '### {key}\n{value}', // 修改默认规则
 *      source: '### 源代码地址: {value}'  // 自己制定规则
 * });
 **/

/* eslint-disable fecs-camelcase */
import * as filter from 'filter-files';
import * as fs from 'fs';
import * as Path from 'path';
import * as glob from 'glob';
import * as defaultConfig from './config';
import * as utils from './utils';
const mkdir = require('mk-dir');
const debug = require('debug')('lazydoc');

export default function doc(path, output: string|Function = '', options = null) {
    if (!path) {
        throw new Error('lazy-doc(path, output, options) path need to be string.');
    }
    path = Path.resolve(process.cwd(), path);
    let files = isGlob(path) ? glob.sync(path) : (isDirectory(path) ? filter.sync(path) : [path]);
    let marks = [];
    options = getOptions(options);
    // console.log('files:', path, files);
    files.forEach(function (filepath) {
        try {
            let ext = Path.extname(filepath).toLowerCase();
            // 忽略部分文件扩展名            
            if (options.ignoreExt && options.ignoreExt.indexOf(ext) >= 0) {
                return;
            }
            let source = fs.readFileSync(filepath, 'utf8');
            if (ext === '.md') {
                marks.push({
                    filepath,
                    markdown: Markdown(source, filepath, options),
                    list: [],
                    index: 0
                });
                return;
            }
            let doc = {filepath, origin: source};
            if (typeof options.beforeParse === 'function') {
                options.beforeParse(doc);
            }
            let list = utils.getMarks(doc.origin);
            marks = marks.concat({
                filepath,
                list,
                index: list[0] ? list[0].index || 0 : 0
            });
        }
        catch (e) {
            console.error('LazyDocError', e);
        }
    });
    marks.sort((m1, m2) => m1.index - m2.index);
    let markdown = marks.map(one => {
        one.markdown = one.markdown || utils.parseNoteMark(one.list, options);
        debug('mark2markdown:', {
            filepath: one.filepath,
            markdown: one.markdown,
            list: one.list.map(v => {
                return {
                    key: v.key, value: v.value
                }
            })
        });
        return one.markdown;
    }).filter(m => m).join('\n');
    
    if (typeof output === 'string' && output) {
        output = Path.resolve(output);
        if (!isDirectory(output)) {
            // 写入单个文件
            write({filepath: output, origin: undefined, content: markdown}, options);
        }
        else {
            // 写入文件列表
            if (path.indexOf('*') >= 0) {
                path = Path.dirname(path.substr(0, path.indexOf('*')));
            }
            let mds = {};
            marks.forEach(m => {
                mds[m.filepath] = mds[m.filepath] || '';
                mds[m.filepath] += m.markdown;
            });
            for(let filepath in mds) {
                let markdown = mds[filepath];
                filepath = (output + '/' + filepath.replace(path, '')).replace('//', '/');
                filepath = filepath + '.md';
                write({filepath, origin: undefined, content: markdown}, options);
            }
        }
    }
    else if (typeof output === 'function') {
        output(markdown, marks);
    }

    return markdown;
};

function isGlob(path = '') {
    return !!path.match(/[*?[\]!|()]/)
}

function getOptions(options = null) {
    options = Object.assign({}, defaultConfig, options);
    options.templates = Object.assign({}, defaultConfig.templates, options.templates);
    return options;
}

function isDirectory(path) {
    let parsed = Path.parse(path);
    if (parsed.ext.length >= 1) {
        return false;
    }
    return true;
}

// markdown文件处理
export function Markdown(source, filepath, options) {
    console.log('markdown:', filepath);
    let result = source.replace(/(<!--+@doc\s([\w.\/]+)--+>)[\s\S]*?(<!--+@end--+>)/g, function(all, pre, path) {
        path = Path.dirname(filepath) + '/' + path;
        let md = doc(path, '', options);
        console.log('file in markdown:', path);
        // console.log('source:', {path, pre, md});
        return pre + '\n' + md + '\n<!--@end-->';
    });
    return result;
}

function write(ctx: any, options) {
    if (typeof options.beforeWrite === 'function') {
        options.beforeWrite(ctx);
    }
    if (ctx.filepath && ctx.content !== ctx.origin) {
        mkdir(Path.dirname(ctx.filepath));
        fs.writeFileSync(ctx.filepath, ctx.content, 'utf8');
    }
}

module.exports = doc;