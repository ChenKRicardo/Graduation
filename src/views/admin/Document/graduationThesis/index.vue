<template>
  <div class="literature">
    <div class="literature-text"><h3>毕业论文信息统计</h3></div>
    <el-card>
      <!-- 头部 -->
      <div class="literatureHeader">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          clearable
          v-model="search"
          style="width: 15%"
          @clear="clearSearch"
        >
        </el-input>
        <el-button type="primary" style="margin: 10px" @click="searchInfo"
          >查询</el-button
        >
        <el-button type="success" @click="lookLiterature">信息统计</el-button>
      </div>
      <!-- 表格信息 -->
      <div class="tabel-content">
        <el-table
          ref="multipleTable"
          :data="graduationInfo"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px"
          border
        >
          <el-table-column label="序号" type="index" width="80px" center="true">
          </el-table-column>
          <el-table-column prop="chooseTitle" label="论文题目" width="width">
          </el-table-column>
          <el-table-column prop="teacherName" label="评阅教师" width="width">
          </el-table-column>
          <el-table-column prop="studentName" label="学生姓名" width="width">
          </el-table-column>
          <el-table-column prop="result" label="审核结果" width="width">
          </el-table-column>
          <el-table-column prop="commitStatus" label="提交状态" width="width">
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getGratuation"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,->,total, sizes"
        :total="total"
      >
      </el-pagination>
      <!-- 对话框，Echarts图 -->
      <el-dialog
        title="毕业论文信息统计"
        :visible.sync="dialogVisible"
        :center="true"
      >
        <div class="dialogInfo">
          <!-- 左部分card -->
          <div class="literature-card">
            <el-card class="card-count">
              <i class="el-icon-user-solid"></i>
              <span class="font">总人数:{{ total }}人</span>
            </el-card>
            <el-card class="card-uncommit">
              <i class="el-icon-close"></i>
              <span class="font">未提交人数:{{ unCommit }}人</span>
            </el-card>
            <el-card class="card-commiting">
              <i class="el-icon-check"></i>
              <span class="font">已提交人数:{{ commiting }}人</span>
            </el-card>
            <el-card class="card-unsuccess">
              <i class="el-icon-document-delete"></i>
              <span class="font"> 审核未通过人数:{{ failed }}人</span>
            </el-card>
            <el-card class="card-success">
              <i class="el-icon-document-checked"></i>
              <span class="font"> 审核通过人数:{{ passed }}人</span>
            </el-card>
          </div>
          <!-- 右部分echarts -->
          <div class="PieCharts">
            <PieCharts
              :total="total"
              :unCommit="unCommit"
              :failed="failed"
              :passed="passed"
              :commiting="commiting"
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
  name: "GraduationReview",
  components: {
    PieCharts,
  },
  data() {
    return {
      graduationInfo: [],
      search: "",
      dialogVisible: false,
      page: 1,
      limit: 3,
      total: 0,
      failed: 0,
      passed: 0,
      unCommit: 0,
      commiting: 0,
    };
  },
  methods: {
    lookLiterature() {
      this.dialogVisible = true;
    },
    async getGratuation(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      try {
        let result = await this.$API.admin.reqStatisticsGraduationInfo(
          page,
          limit
        );
        this.graduationInfo = result.data;
        this.failed = result.totalPage;
        this.total = result.total;
        this.passed = result.passed;
        this.unCommit = result.unCommit;
        this.commiting = result.commiting;
      } catch (error) {
        console.log(error);
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getGratuation();
    },
    searchInfo() {
      const {search} = this
        this.graduationInfo =this.graduationInfo.filter((item) => {
        if (item.chooseTitle.indexOf(search) !== -1) {
            return item;
          }
      });
    },
    clearSearch() {
      this.getGratuation();
    },
  },
  mounted() {
    this.getGratuation();
  },
};
</script>

<style lang="scss" scoped>
.literature {
  margin: 20px;
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
.tabel-content {
  margin-right: 40px;
}
.literatureHeader {
  margin-left: 20px;
}
.literature-card {
  width: 39%;
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
    background: rgb(212, 77, 77);
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
  .card-unsuccess {
    margin: 10px;
    background: rgb(188, 29, 29);
  }
}
.dialogInfo {
  display: flex;
  justify-content: space-around;
}
</style>
