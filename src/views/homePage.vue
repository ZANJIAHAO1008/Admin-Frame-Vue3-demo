<template>
  <div>
    <div id="countCharts" class="countCharts"></div>
  </div>
</template>
<script>
import {inject, onMounted, defineComponent} from "vue";

export default defineComponent({
  name: "homePage",
  setup() {
    let echarts = inject("echarts");//引入echarts

    onMounted(() => {
      // window.onresize = function () {//自适应大小
      //   statistics();
      // };
      statistics();
    })

    const statistics = () => {
      //统计
      let myChart = echarts.init(document.getElementById("countCharts"));
      // 绘制图表
      let option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }]
      };
      myChart.setOption(option);
    };

    return {
      statistics,
    }
  }
})
</script>
<style lang="scss" scoped>
.countCharts {
  //width: 1000px;
  height: 380px;
}
</style>
