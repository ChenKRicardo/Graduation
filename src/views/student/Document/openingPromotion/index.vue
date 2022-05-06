<template>
  <div class="openingUpload">
    <div class="openingUpload-text"><h3>开题报告上传</h3></div>
    <el-upload
      :on-success="successUpload"
      class="upload-demo"
      drag
      action="/api/student/openingUpload"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将开题报告文档拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
    <el-card style="margin-top: 20px">
      <el-table :data="opening" style="width: 100%" border>
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
    <el-drawer title="开题报告审核意见" :visible.sync="drawer">
      <span>{{ advice }}</span>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "openingPromotion",
  data() {
    return {
      studentID: "",
      opening: [
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
      if (this.opening[0].chooseTitle) {
        this.$message({ type: "success", message: "开题报告上传成功" });
        await this.$API.student.reqUploadOpening();
        this.getOpeningInfo();
      } else {
        this.$message({ type: "warning", message: "选题后才能上传开题报告" });
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
    async getOpeningInfo() {
      setTimeout(async () => {
        try {
          let result = await this.$API.student.reqGetOpeningInfo(
            this.studentID
          );
          Object.assign(this.opening[0], result.data);
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
    this.getOpeningInfo();
  },
};
</script>

<style lang="scss" scoped>
.openingUpload {
  margin: 30px;
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
</style>
