/**
 * @file 测试函数参数
 */

/**
 * 测试api文档生成器,计算两个数的和
 * @function
 * @index 10
 * @param {number} param1 参数1
 * @param {number} param2 参数2
 * @param {number} param2.test 子参数
 * @param {number|Function} param2.muliter 多类型数据
 * @return {string}
 * @example 第一个示例
 * var a = add(1,2);
 * console.log(a); // 3
 */
function add(param1, param2) {
    return param1 + param2;
}
