<template>
  <div class="Selection">
    <div class="Selection-text"><h3>选题管理</h3></div>
    <el-card>
      <div class="tabel-header">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        clearable
        v-model="search"
        style="width: 15%"
      >
      </el-input>
      <el-button type="primary" style="margin: 10px">查询</el-button>
      <el-button type="danger" >批量删除</el-button>
      </div>
      <!-- 表格 -->
      <div class="tabel-content">
        <el-table
          ref="multipleTable"
          :data="titleMenu"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px"
          border
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="序号" type="index" width="80px" center="true">
          </el-table-column>
          <el-table-column prop="title" label="题目" width="width">
          </el-table-column>
          <el-table-column prop="teacherName" label="开题教师" width="120px">
          </el-table-column>
          <el-table-column prop="studentName" label="选题学生" width="width">
          </el-table-column>
          <el-table-column prop="chooseStatus" label="选题状态" width="width">
          </el-table-column>
          <el-table-column
            prop="specialized"
            label="题目所属专业"
            width="width"
          >
          </el-table-column>
          <el-table-column prop="teacherName" label="评阅老师" width="width">
          </el-table-column>
          <el-table-column label="操作" width="300px" :center="true">
            <template>
              <el-button type="success" size="mini" icon="el-icon-check"
                >审批</el-button
              >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="NonConforming"
                >不合格</el-button
              >
              <el-button type="danger" size="mini" icon="el-icon-delete-solid"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <el-pagination
        :current-page="1"
        :page-sizes="[3,5, 10]"
        :page-size="3"
        layout=" prev, pager, next, jumper,->,total, sizes"
        :total="20"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog title="不合格原因" :visible.sync="dialogFormVisible">
      <el-input placeholder="请输入不合格原因" type="textarea"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Selection",
  data() {
    return {
      search: "",
      titleMenu: [
        {
          title: "毕业设计管理系统",
          teacherName: "甘老师",
          studentName: "陈康",
          chooseStatus: "已选",
          specialized: "软件工程",
        },
      ],
      dialogFormVisible: false,
    };
  },
  methods: {
    NonConforming() {
      this.dialogFormVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.Selection {
  margin: 30px;
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
.tabel-header {
  margin-left: 20px;
}
.tabel-content{
  margin-right: 40px;
}
</style>
