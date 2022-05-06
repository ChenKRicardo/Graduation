<template>
  <div class="grade">
    <div class="grade-text"><h3>论文成绩上传</h3></div>
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
      </div>
      <!-- 表格信息 -->
      <div class="tabel-content">
        <el-table
          ref="multipleTable"
          :data="scoreList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px"
          border
        >
          <el-table-column label="序号" type="index" width="80px" center="true">
          </el-table-column>
          <el-table-column prop="studentName" label="学生姓名" width="80px">
          </el-table-column>
          <el-table-column prop="studentID" label="学生学号" width="width">
          </el-table-column>
          <el-table-column prop="teacherName" label="评阅教师" width="width">
          </el-table-column>
          <el-table-column prop="title" label="论文题目" width="width">
          </el-table-column>
          <el-table-column prop="graduateScore" label="论文成绩" width="80px">
          </el-table-column>
          <el-table-column prop="deviseScore" label="毕设成绩" width="80px">
          </el-table-column>
          <el-table-column prop="ReplyScore" label="答辩成绩" width="80px">
          </el-table-column>
          <el-table-column prop="totalScore" label="成绩总分" width="80px">
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-upload"
                @click="createStudentScore(row)"
                >上传</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="editScore(row)"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getScoreList"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,total, sizes"
          :total="total"
        >
        </el-pagination>
        <!-- 创建OR修改成绩 -->
        <el-dialog
          :title="dialogtitel == true ? '创建成绩' : '修改成绩'"
          :visible.sync="dialogFormVisible"
          :show-close="false"
          model="form"
        >
          <el-form label-width="80px">
            <el-form-item label="论文成绩">
              <el-input v-model="form.graduateScore"></el-input>
            </el-form-item>
            <el-form-item label="毕设成绩">
              <el-input v-model="form.deviseScore"></el-input>
            </el-form-item>
            <el-form-item label="答辩成绩">
              <el-input v-model="form.ReplyScore"></el-input>
            </el-form-item>
            <el-form-item label="总成绩">
              <el-input v-model="totalScore"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ViewGrades",
  data() {
    return {
      scoreList: [],
      dialogFormVisible: false,
      dialogtitel: true,
      page: 1,
      limit: 3,
      total: 0,
      form: {
        graduateScore: "",
        deviseScore: "",
        ReplyScore: "",
        totalScore: "",
      },
      studentId: "",
    };
  },
  methods: {
    editScore(row) {
      this.dialogFormVisible = true;
      this.dialogtitel = false;
      this.studentId = row.studentID;
      Object.assign(this.form, row);
    },
    createStudentScore(row) {
      this.dialogFormVisible = true;
      this.dialogtitel = true;
      this.studentId = row.studentID;
    },
    async getScoreList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      try {
        let result = await this.$API.teacher.reqGetStudentScoreInfo(
          page,
          limit
        );
        this.total = result.total;
        this.scoreList = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getScoreList();
    },
    cancle() {
      this.dialogFormVisible = false;
      this.form.graduateScore = "";
      this.form.deviseScore = "";
      this.form.ReplyScore = "";
    },
    async confirm() {
      this.dialogFormVisible = false;
      const { studentId, dialogtitel, form } = this;
      if (dialogtitel) {
        try {
          this.form.totalScore = this.totalScore;
          await this.$API.teacher.reqCreateStudentScore(studentId, form);
          this.$message({ type: "success", message: "成绩上传成功" });
          this.getScoreList();
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          this.form.totalScore = this.totalScore;
          await this.$API.teacher.reqUpdateStudentScore(studentId, form);
          this.$message({ type: "success", message: "成绩修改成功" });
          this.getScoreList();
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  mounted() {
    this.getScoreList();
  },
  computed: {
    totalScore() {
      const { graduateScore, deviseScore, ReplyScore } = this.form;
      return graduateScore * 0.4 + deviseScore * 0.4 + ReplyScore * 0.2;
    },
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
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.tabel-content {
  margin-right: 40px;
}
</style>
