<template>
  <div class="graduationUpload">
    <div class="graduationUpload-text"><h3>毕业论文上传</h3></div>
    <el-upload
      :on-success="successUpload"
      class="upload-demo"
      drag
      action="/api/student/graduationUpload"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将毕业论文文档拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
    <el-card style="margin-top: 20px">
      <el-table :data="graduation" style="width: 100%" border>
        <el-table-column prop="chooseTitle" label="论文题目" width="width">
        </el-table-column>
        <el-table-column prop="commitStatus" label="提交状态" width="width">
        </el-table-column>
        <el-table-column prop="teacherName" label="审核老师" width="width">
        </el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" width="width">
        </el-table-column>
        <el-table-column prop="result" label="审核结果" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template>
            <el-button
              type="info"
              title="查看审核意见"
              icon="el-icon-info"
              @click="showAdvice"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-drawer title="论文审核意见" :visible.sync="drawer">
      <span>{{ advice }}</span>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "graduationPromotion",
  data() {
    return {
      studentID: "",
      graduation: [
        {
          chooseTitle: "",
          commitStatus: "",
          teacherName: "",
          auditStatus: "",
          result: "",
        },
      ],
      drawer: false,
      advice: "",
    };
  },
  methods: {
    async successUpload() {
      if (this.graduation[0].chooseTitle) {
        this.$message({ type: "success", message: "毕业论文上传成功" });
        await this.$API.student.reqUploadGraduation();
        this.getGraduationInfo();
      } else {
        this.$message({ type: "warning", message: "选题后才能上传毕业论文" });
      }
    },
    async getStudentInfo() {
      try {
        let result = await this.$API.student.reqGetStudentInfo();
        this.studentID = result.data.userID;
      } catch (error) {
        console.log(error);
      }
    },
    async getGraduationInfo() {
      setTimeout(async () => {
        try {
          let result = await this.$API.student.reqGetGraduationInfo(
            this.studentID
          );
          Object.assign(this.graduation[0], result.data);
          this.advice = result.data.advice;
        } catch (error) {
          console.log(error);
        }
      }, 500);
    },
    showAdvice() {
      this.drawer = true;
    },
  },
  mounted() {
    this.getStudentInfo();
    this.getGraduationInfo();
  },
};
</script>

<style lang="scss" scoped>
.graduationUpload {
  margin: 30px;
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
</style>
