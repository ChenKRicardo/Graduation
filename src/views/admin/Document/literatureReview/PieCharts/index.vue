<template>
  <div class="literature-echarts" ref="echarts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "PieCharts",
  props: ["total", "unCommit", "failed", "passed", "commiting", "unCommit"],
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
        text: "审核通过人数",
        subtext: this.passed,
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
          name: "文献综述信息统计",
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
            { value: this.total, name: "总人数" },
            { value: this.unCommit, name: "未提交人数" },
            { value: this.commiting, name: "已提交人数" },
            { value: this.passed, name: "审核通过人数" },
            { value: this.failed, name: "审核未通过人数" },
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

<style>
.literature-echarts {
  width: 400px;
  height: 350px;
}
</style>
