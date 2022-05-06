<template>
  <div class="grade">
    <div class="grade-text"><h3>论文成绩查看</h3></div>
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
          :data="GradeMenu"
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
          <el-table-column
            prop="graduateScore"
            label="论文成绩"
            width="width"
          >
          </el-table-column>
          <el-table-column
            prop="deviseScore"
            label="毕设成绩"
            width="width"
          >
          </el-table-column>
          <el-table-column prop="ReplyScore" label="答辩成绩" width="width">
          </el-table-column>
          <el-table-column prop="totalScore" label="成绩总分" width="width">
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ViewGrades",
  data() {
    return {
      GradeMenu: [
        {
          studentName: "",
          teacherName: "",
          title: "",
          graduateScore: '',
          deviseScore: '',
          ReplyScore: '',
          totalScore: '',
        },
      ],
      studentID: '',
    };
  },
  methods: {
    async viewScore() {
      let studentInfo = await this.$API.student.reqGetStudentInfo();
      this.studentID = studentInfo.data.userID;
      const { studentID,GradeMenu } = this;
      try {
        let result = await this.$API.student.reqViewScore(studentID);
        Object.assign(GradeMenu[0],result.data)
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.viewScore();
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
}
.tabel-content {
  margin-right: 40px;
}
</style>
