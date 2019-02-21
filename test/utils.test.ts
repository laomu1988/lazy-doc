/**
 * @file 测试代码
 */
/* eslint-disable fecs-camelcase */
/* global test */

let utils = require('../src/utils');

test('utils.getFunctionName', () => {
    expect(utils.getFunctionName('function test(')).toBe('test');
    expect(utils.getFunctionName(' function test (')).toBe('test');
    expect(utils.getFunctionName(' test (')).toBe('test');
    expect(utils.getFunctionName('test(')).toBe('test');
    expect(utils.getFunctionName('test')).toBe('');
    expect(utils.getFunctionName('')).toBe('');
    expect(utils.getFunctionName('// test(')).toBe('');
});
