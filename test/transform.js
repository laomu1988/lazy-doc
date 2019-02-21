/**
 * @file 转换ts代码为js代码
 */
const config = require('../babel.config.js');
module.exports = require('babel-jest').createTransformer(config);
