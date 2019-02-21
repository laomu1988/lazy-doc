/**
 * @file 公共函数
 */

/**
 * 从函数列获取函数名
 * @param {string} line 函数代码
 * @return {string} 函数名称。假如不是函数定义代码格式，则返回空字符串
 */
export function getFunctionName(line: string) {
    let match = line.match(/^([^/]*)(function\s+)?\b(\w+)\s*\(/)
    return match ? match[3] : '';
}
