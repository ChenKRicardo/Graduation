<template>
  <div class="literatureUpload">
    <div class="literatureUpload-text"><h3>文献综述上传</h3></div>
    <el-upload
      :on-success="successUpload"
      class="upload-demo"
      drag
      action="/api/student/literatureUpload"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文献综述文档拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
    <el-card style="margin-top: 20px">
      <el-table :data="literature" style="width: 100%" border>
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
    <el-drawer title="文献综述审核意见" :visible.sync="drawer">
      <span>{{ advice }}</span>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "literaturePromotion",
  data() {
    return {
      studentID: "",
      literature: [
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
      if (this.literature[0].chooseTitle) {
        this.$message({ type: "success", message: "文献综述上传成功" });
        await this.$API.student.reqUploadLiterature();
        this.getLiteratureInfo();
      } else {
        this.$message({ type: "warning", message: "选题后才能上传文献综述" });
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
    async getLiteratureInfo() {
      setTimeout(async () => {
        try {
          let result = await this.$API.student.reqGetLiteratureInfo(
            this.studentID
          );
          Object.assign(this.literature[0], result.data);
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
    this.getLiteratureInfo();
  },
};
</script>

<style lang="scss" scoped>
.literatureUpload {
  margin: 30px;
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
</style>
