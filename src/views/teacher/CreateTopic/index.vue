<template>
  <div class="Topic">
    <div class="Topic-text"><h3>选题创建</h3></div>
    <el-card>
      <div class="tabel-header">
        <el-button type="success" @click="createTopic">创建选题</el-button>
        <el-button type="danger" @click="deleteCheckTpoic">批量删除</el-button>
      </div>
      <!-- 表格 -->
      <div class="tabel-content">
        <el-table
          ref="multipleTable"
          :data="tpoicList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="序号" type="index" width="80px" center="true">
          </el-table-column>
          <el-table-column prop="title" label="题目" width="width">
          </el-table-column>
          <el-table-column prop="openingTeacher" label="开题教师" width="120px">
          </el-table-column>
          <el-table-column prop="topicStatus" label="选题状态" width="80px">
          </el-table-column>
          <el-table-column
            prop="specialized"
            label="题目所属专业"
            width="width"
          >
          </el-table-column>
          <el-table-column label="操作" width="300px" :center="true">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-check"
                @click="editTopic(row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete-solid"
                @click="deleteTpoic(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getTpociList"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,->,total, sizes"
        :total="total"
      >
      </el-pagination>
      <!-- 创建选题OR修改选题 -->
      <el-dialog
        :title="dialogTitle === true ? '创建选题' : '修改选题'"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="form" ref="form" status-icon>
          <el-form-item label="题目">
            <el-input
              prefix-icon="el-icon-tickets"
              v-model="form.title"
            ></el-input>
          </el-form-item>
          <el-form-item label="开题教师">
            <el-input
              prefix-icon="el-icon-s-custom"
              :disabled="true"
              v-model="form.openingTeacher"
            ></el-input>
          </el-form-item>
          <el-form-item label="选题状态">
            <el-input
              prefix-icon="el-icon-view"
              v-model="form.topicStatus"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="选题专业">
            <el-select
              v-model="form.specialized"
              placeholder="请选择专业"
              style="width: 100%"
            >
              <el-option
                v-for="(specialized, index) in specializedList"
                :key="index"
                :label="specialized.label"
                :value="specialized.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancle">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CreateTopic",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      tpoicList: [],
      dialogFormVisible: false,
      dialogTitle: true,
      form: {
        id: "",
        title: "",
        openingTeacher: "",
        topicStatus: 0,
        specialized: "",
      },
      specializedList: [
        {
          value: "软件工程",
          label: "软件工程",
        },
        {
          value: "互联网工程",
          label: "互联网工程",
        },
        {
          value: "通信工程",
          label: "通信工程",
        },
      ],
      deleteTpoicList: [],
    };
  },
  methods: {
    async createTopic() {
      this.dialogFormVisible = true;
      this.dialogTitle = true;
      let result = await this.$API.teacher.reqGetTeacherInfo();
      this.form = {};
      this.form.openingTeacher = result.data.teacherName;
      this.form.topicStatus = 0;
    },
    editTopic(row) {
      this.dialogFormVisible = true;
      this.dialogTitle = false;
      Object.assign(this.form, row);
    },
    async getTpociList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      try {
        let result = await this.$API.student.reqGetAllTpoic(page, limit);
        this.total = result.total;
        this.tpoicList = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTpociList();
    },
    cancle() {
      this.dialogFormVisible = false;
      this.form = {};
    },
    async confirm() {
      this.dialogFormVisible = false;
      const { form } = this;
      try {
        await this.$API.teacher.reqAddOrUpdateTpoic(form);
        this.$message({
          type: "success",
          message: form.id ? "修改题目成功" : "创建题目成功",
        });
        this.getTpociList(this.page);
      } catch (error) {
        console.log(error);
      }
    },
    async deleteTpoic(tpioc) {
      this.$confirm("此操作将永久删除选题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$API.teacher.reqDeleteTpoic(tpioc.id);
            this.getTpociList(
              this.tpoicList.length > 1 ? this.page : this.page - 1
            );
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } catch (error) {
            console.log(error);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async handleSelectionChange(tpoic) {
      this.deleteTpoicList = tpoic;
    },
    deleteCheckTpoic() {
      this.$confirm("此操作将永久删除选题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let promises = [];
          this.deleteTpoicList.forEach(async (item) => {
            let promise = await this.$API.teacher.reqDeleteTpoic(item.id);
            promises.push(promise);
          });
          this.getTpociList(this.page);
          return Promise.all(promises).catch(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getTpociList();
  },
};
</script>

<style lang="scss" scoped>
.Topic {
  margin: 30px;
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
.tabel-header {
  margin-left: 20px;
}
.tabel-content {
  margin-right: 40px;
}
</style>
