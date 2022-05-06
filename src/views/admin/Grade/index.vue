<template>
  <div class="grade">
    <div class="grade-text"><h3>成绩信息统计</h3></div>
    <el-card>
      <!-- 头部 -->
      <div class="gradeHeader">
        <el-alert
          style="width: 50%"
          title="成绩计算规则"
          type="info"
          description="学生论文成绩权重为:0.4;毕业设计权重为:0.4;答辩成绩权重为:0.2"
          show-icon
          :closable="false"
          effect="dark"
        >
        </el-alert>
        <el-button type="success" size="mini" @click="showEcharts"
          >成绩统计</el-button
        >
      </div>
      <!-- 表格信息 -->
      <div class="tabel-content">
        <el-table
          ref="multipleTable"
          :data="gradeList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px"
          border
        >
          <el-table-column label="序号" type="index" width="80px" center="true">
          </el-table-column>
          <el-table-column prop="studentName" label="学生姓名" width="width">
          </el-table-column>
          <el-table-column prop="teacherName" label="评阅教师" width="width">
          </el-table-column>
          <el-table-column prop="title" label="论文题目" width="width">
          </el-table-column>
          <el-table-column prop="graduateScore" label="论文成绩" width="width">
          </el-table-column>
          <el-table-column prop="deviseScore" label="毕设成绩" width="width">
          </el-table-column>
          <el-table-column prop="ReplyScore" label="答辩成绩" width="width">
          </el-table-column>
          <el-table-column prop="totalScore" label="成绩总分" width="width">
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getStudentScore"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,->,total, sizes"
        :total="total"
      >
      </el-pagination>
      <!-- Dialog -->
      <el-dialog title="修改成绩" :visible.sync="dialogFormVisible">
        <el-form label-width="80px">
          <el-form-item label="论文成绩">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="毕设成绩">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="答辩成绩">
            <el-input></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 对话框，Echarts图 -->
      <el-dialog
        title="学生成绩信息统计"
        :visible.sync="dialogEchartsVisible"
        :center="true"
        width="55%"
      >
        <div class="dialogInfo">
          <!-- 左部分card -->
          <div class="literature-card">
            <el-card class="card-count">
              <i class="el-icon-trophy"></i>
              <span class="font">90-100分人数:{{NineToTen}}人</span>
            </el-card>
            <el-card class="card-uncommit">
              <i class="el-icon-medal"></i>
              <span class="font">80-90分人数:{{EightToNine}}人</span>
            </el-card>
            <el-card class="card-commiting">
              <i class="el-icon-check"></i>
              <span class="font">70-80分人数:{{SevenToEight}}人</span>
            </el-card>
            <el-card class="card-success">
              <i class="el-icon-message-solid"></i>
              <span class="font"> 60-70分人数:{{SixToSeven}}人</span>
            </el-card>
            <el-card class="card-danger">
              <i class="el-icon-s-opportunity"></i>
              <span class="font"> 60分以下:{{SixToLow}}人</span>
            </el-card>
          </div>
          <!-- 右部分echarts -->
          <div>
            <PieCharts
              :NineToTen="NineToTen"
              :EightToNine="EightToNine"
              :SevenToEight="SevenToEight"
              :SixToSeven="SixToSeven"
              :SixToLow="SixToLow"
              :total="total"
            />
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import PieCharts from "./PieCharts";
export default {
  name: "Grade",
  components: {
    PieCharts,
  },
  data() {
    return {
      gradeList: [],
      dialogFormVisible: false,
      dialogEchartsVisible: false,
      limit: 3,
      page: 1,
      total: 0,
      EightToNine: 0,
      NineToTen: 0,
      SevenToEight: 0,
      SixToLow: 0,
      SixToSeven: 0,
    };
  },
  methods: {
    async getStudentScore(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      try {
        let result = await this.$API.admin.reqGetStudentScoreInfo(page, limit);
        this.gradeList = result.data;
        this.total = result.total
        this.EightToNine = result.EightToNine;
        this.NineToTen = result.NineToTen;
        this.SevenToEight = result.SevenToEight;
        this.SixToLow = result.SixToLow;
        this.SixToSeven = result.SixToSeven;
      } catch (error) {
        console.log(error);
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getStudentScore();
    },
    showEcharts() {
      this.dialogEchartsVisible = true;
    },
  },
  mounted() {
    this.getStudentScore();
  },
};
</script>

<style lang="scss" scoped>
.grade {
  margin: 30px;
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
.gradeHeader {
  display: flex;
  margin: 20px;
  justify-content: space-between;
}
.tabel-content {
  margin-right: 40px;
}
.literatureHeader {
  margin-left: 20px;
}
.literature-card {
  width: 34%;
  margin: 20px;
  i,
  span {
    font-size: 16px;
    color: #fff;
    margin: 5px;
  }
  .card-count {
    background: rgb(48, 48, 66);
    margin: 10px;
  }
  .card-uncommit {
    background: rgb(88, 199, 171);
    margin: 10px;
  }
  .card-commiting {
    background: rgb(155, 190, 103);
    margin: 10px;
  }
  .card-success {
    background: skyblue;
    margin: 10px;
  }
  .card-danger {
    background: rgb(212, 77, 77);
    margin: 10px;
  }
}
.dialogInfo {
  display: flex;
  justify-content: space-between;
}
</style>
