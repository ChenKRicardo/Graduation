<template>
  <div class="Account-student">
    <div class="student-text"><h3>学生账号管理</h3></div>
    <el-card>
      <!-- 头部按钮 -->
      <div class="tabel-header">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          clearable
          v-model="search"
          style="width: 15%"
        >
        </el-input>
        <div class="header-button">
          <el-button type="primary" @click="addStudent">添加账号</el-button>
          <el-button type="danger">批量删除</el-button>
        </div>
      </div>
      <!-- 表格内容 -->
      <div class="tabel-content">
        <el-table
          ref="multipleTable"
          :data="studentData"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px"
          border
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="序号" type="index" width="80px" center="true">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="80px">
          </el-table-column>
          <el-table-column prop="studentID" label="学号" width="width">
          </el-table-column>
          <el-table-column prop="specialized" label="专业" width="width">
          </el-table-column>
          <el-table-column prop="academy" label="学院" width="width">
          </el-table-column>
          <el-table-column prop="degree" label="学历" width="80px">
          </el-table-column>
          <el-table-column prop="phone" label="电话" width="width">
          </el-table-column>
          <el-table-column prop="address" label="邮箱" width="width">
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template>
              <el-button
                type="success"
                size="mini"
                icon="el-icon-edit"
                @click="editStudentInfo"
                >修改</el-button
              >
              <el-button type="danger" size="mini" icon="el-icon-delete-solid"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 弹出框 -->
      <el-dialog
        :title="dialogTitle === 0 ? '修改学生信息' : '添加学生信息'"
        :visible.sync="dialogFormVisible"
      >
        <el-form :inline="true">
          <el-form-item label="学号">
            <el-input prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item label="学院" style="float: right">
            <el-select clearable placeholder="请选择" value="">
              <el-option label="人工智能" value="人工智能"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Student",

  data() {
    return {
      studentData: [
        {
          name: "陈康",
          studentID: "1820070129",
          degree: "本科",
          academy: "人工智能",
          specialized: "软件工程",
          phone: "13155836512",
          address: "137575582@qq.com",
        },
      ],
      dialogFormVisible: false,
      dialogTitle: 0,
      search: "",
    };
  },
  methods: {
    editStudentInfo() {
      this.dialogTitle = 0;
      this.dialogFormVisible = true;
    },
    addStudent() {
      this.dialogTitle = 1;
      this.dialogFormVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.Account {
  &-student {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.tabel-header {
  display: flex;
  margin-left: 20px;
  justify-content: space-between;
}
.tabel-content {
  margin-right: 40px;
}
.header-button {
  margin-right: 19px;
}
</style>
