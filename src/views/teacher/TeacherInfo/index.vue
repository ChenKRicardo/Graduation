<template>
  <div class="Teacher">
    <div class="teacher-text"><h3>教师个人信息</h3></div>
    <el-card>
      <div class="tabel-content">
        <!-- 学生信息表格 -->
        <el-table
          ref="multipleTable"
          :data="teacherInfo"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px"
          border
        >
          <el-table-column label="序号" type="index" width="80px" center="true">
          </el-table-column>
          <el-table-column prop="teacherName" label="姓名" width="120px">
          </el-table-column>
          <el-table-column prop="userID" label="职工号" width="width">
          </el-table-column>
          <el-table-column prop="academy" label="学院" width="width">
          </el-table-column>
          <el-table-column prop="jobTitle" label="职称" width="width">
          </el-table-column>
          <el-table-column prop="phone" label="电话" width="width">
          </el-table-column>
          <el-table-column prop="mailbox" label="邮箱" width="width">
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template>
              <el-button
                type="success"
                size="mini"
                icon="el-icon-edit"
                @click="editTeacherInfo"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 修改教师信息弹出框 -->
    <!-- 弹出框 -->
    <el-dialog title="修改个人信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="editRules" ref="form" status-icon>
        <el-form-item label="姓名">
          <el-input
            prefix-icon="el-icon-user"
            v-model="form.teacherName"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input prefix-icon="el-icon-phone" v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            prefix-icon="el-icon-monitor"
            v-model="form.mailbox"
          ></el-input>
        </el-form-item>
        <el-form-item label="修改密码">
          <el-input
            prefix-icon="el-icon-warning"
            type="password"
            v-model="form.newPassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            prefix-icon="el-icon-warning"
            type="password"
            v-model="form.confirmNewPassword"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TeacherInfo",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 && value.length > 10) {
        callback(new Error("密码长度必须在6-10位"));
      } else {
        callback();
      }
    };
    const validateConfirmNewPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      teacherInfo: [
        {
          teacherName: "",
          userID: "",
          jobTitle: "",
          mailbox: "",
          phone: "",
        },
      ],
      form: {
        teacherName: "",
        phone: "",
        mailbox: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      editRules: {
        teacherName: [{ required: true, trigger: "blur" }],
        phone: [{ required: true, trigger: "blur" }],
        mailbox: [{ required: true, trigger: "blur" }],
        newPassword: [{ validator: validatePassword, trigger: "blur" }],
        confirmNewPassword: [
          { validator: validateConfirmNewPassword, trigger: "blur" },
        ],
      },
      dialogFormVisible: false,
    };
  },
  methods: {
    //获取教师信息
    async getTeacherInfo() {
      let result = await this.$API.teacher.reqGetTeacherInfo();
      Object.assign(this.teacherInfo[0], result.data);
    },
    //修改教师信息
    editTeacherInfo() {
      this.dialogFormVisible = true;
    },
    cancel() {
      this.dialogFormVisible = false;
      this.form = {};
    },
    async confirmEdit() {
      this.dialogFormVisible = false;
      const { form } = this;
      let result = await this.$API.teacher.reqUpdateTeacherInfo(form);
      if (result.code == 200) {
        this.getTeacherInfo();
        this.form = {};
      }
    },
  },
  mounted() {
    this.getTeacherInfo();
  },
};
</script>

<style lang="scss" scoped>
.Teacher {
  margin: 30px;
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.tabel-content {
  margin-right: 40px;
}
</style>
