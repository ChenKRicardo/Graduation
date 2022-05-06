<template>
  <div class="opening-echarts" ref="echarts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "PieCharts",
  props:['NineToTen','EightToNine','SevenToEight','SixToSeven','SixToLow','total'],
  data() {
    return {
      value: {},
    };
  },
  mounted() {
    //加载echarts图表
    let myCharts = echarts.init(this.$refs.echarts);
    myCharts.setOption({
      title: {
        text: "90-100分人数",
        subtext: 10,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          top: "50px",
          name: "学生成绩",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "outside",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "16",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: this.NineToTen, name: "90-100分人数" },
            { value: this.EightToNine, name: "80-90分人数" },
            { value: this.SevenToEight, name: "70-80分人数" },
            { value: this.SixToSeven, name: "60-70分人数" },
            { value: this.SixToLow, name: " 60以分下" },
          ],
        },
      ],
    });
    myCharts.on("mouseover", (params) => {
      //获取鼠标移上去的数据
      const { name, value } = params.data;
      myCharts.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scoped>
.opening-echarts {
  width: 450px;
  height: 350px;
}
</style>
