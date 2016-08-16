/**
 * 测试api文档生成器,计算两个数的和
 * @function
 * @index 10
 * @params
 *      param1 第一个参数
 *          property: test
 *      param2 第二个参数
 * @raw
 * @raw和@raw-end中间的内容将不会被转化
 * @raw-end
 * @return {string}
 * @example 第一个示例
 * var a = Add(1,2);
 *
 */
function Add(param1, param2) {
    return param1 + param2;
}