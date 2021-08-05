<template>
  <router-view />
</template>
<script>
import * as echarts from 'echarts'
import {provide} from 'vue'

export default {
  name: 'App',
  setup() {
    provide('echarts', echarts) //全局穿透Echarts
  },
}
</script>
<style lang="less">
@import "./src/style/index.scss";
@import "./src/style/element-ui.scss";
</style>
