<template>
  <div class="opening">
    <div class="opening-text"><h3>开题报告审阅</h3></div>
    <el-card
      ><div class="tabel-content">
        <el-table
          ref="multipleTable"
          :data="openingList"
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
          <el-table-column prop="chooseTitle" label="论文题目" width="width">
          </el-table-column>
          <el-table-column prop="auditStatus" label="审核状态" width="width">
          </el-table-column>
          <el-table-column prop="result" label="审核结果" width="width">
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-upload"
                @click="uploadOpening(row)"
                >上传</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="editOpening(row)"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getOpeningList"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,total, sizes"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 修改OR上传审核意见 -->
    <el-dialog
      :title="dialogTitle == true ? '上传审核信息' : '修改审核信息'"
      :visible.sync="dialogFormVisible"
    >
      <el-form label-width="80px" :model="form">
        <el-form-item label="审核老师">
          <el-input :disabled="true" v-model="form.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-input v-model="form.auditStatus" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="审核结果">
          <el-select v-model="form.result" placeholder="请选择审核状态">
            <el-option
              v-for="(item, index) in status"
              :key="index"
              :label="item.lable"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input type="textarea" v-model="form.advice"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "OpeningReview",
  data() {
    return {
      dialogFormVisible: false,
      dialogTitle: true,
      page: 1,
      limit: 3,
      total: 0,
      openingList: [],
      studentID: "",
      form: {
        teacherName: "",
        auditStatus: "已审核",
        advice: "",
        result:""
      },
      status: [
        {
          value: "已通过",
          label: "已通过",
        },
        {
          value: "未通过",
          label: "未通过",
        },
      ],
    };
  },
  methods: {
    async getTeacherInfo() {
      let result = await this.$API.teacher.reqGetTeacherInfo();
      this.form.teacherName = result.data.teacherName;
    },
    async uploadOpening(row) {
      this.dialogFormVisible = true;
      this.dialogTitle = true;
      this.studentID = row.studentID;
    },
    async editOpening(row) {
      this.dialogFormVisible = true;
      this.dialogTitle = false;
      this.studentID = row.studentID;
      Object.assign(this.form, row);
    },
    async getOpeningList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      try {
        let result = await this.$API.teacher.reqGetStudentOpeningInfo(
          page,
          limit
        );
        this.openingList = result.data;
        this.total = result.total;
      } catch (error) {
        console.log(error);
      }
    },
    handleSizeChange(limit) {
      this.getOpeningList(limit);
    },
    cancle() {
      this.dialogFormVisible = false;
      this.form = {};
      this.$message({
        message: this.dialogTitle ? "已取消上传" : "已取消修改",
      });
    },
    async confirm() {
      if (this.dialogTitle) {
        const { studentID, form } = this;
        try {
          await this.$API.teacher.reqPostOpeningAdvice(studentID, form);
          this.$message({
            type: "success",
            message: "开题报告审核意见上传成功",
          });
          this.getOpeningList();
          this.dialogFormVisible = false;
        } catch (error) {
          console.log(error);
        }
      } else {
        const { studentID, form } = this;
        try {
          await this.$API.teacher.reqUploadOpeningAdvice(studentID, form);
          this.$message({
            type: "success",
            message: "开题报告审核修改意见上传成功",
          });
          this.getOpeningList();
          this.dialogFormVisible = false;
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  mounted() {
    this.getOpeningList();
    this.getTeacherInfo();
  },
};
</script>

<style lang="scss" scoped>
.opening {
  margin: 30px;
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
.tabel-content {
  margin-right: 40px;
}
</style>
