<template>
    <div></div>
</template>
<script>
/* eslint-disable fecs-camelcase */
/**
 * @file Vue测试示例
 */

/**
 * @module Vue
 * vue测试示例
 */
export default {
    props: {
        /**@property prop1 属性1 */
        prop1: String,
        /**@property prop2 属性2 */
        prop2: Number,
        /**
         * @property prop3 属性3
         **/
        prop3: {
            type: Number | String,
            default: 'test'
        }
    },
    data() {
        return {};
    }
};
</script>
<style lang="less" scoped>
</style>