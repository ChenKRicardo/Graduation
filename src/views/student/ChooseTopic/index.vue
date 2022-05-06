<template>
  <div class="Selection">
    <div class="Selection-text"><h3>学生选题</h3></div>
    <el-card>
      <div class="tabel-header">
        <el-input
          placeholder="请输入选题"
          prefix-icon="el-icon-search"
          clearable
          v-model="search"
          style="width: 15%"
          @clear="clearSearch"
        >
        </el-input>
        <el-button type="primary" style="margin: 10px" @click="searchTpoic"
          >查询</el-button
        >
      </div>
      <!-- 表格 -->
      <div class="tabel-content">
        <el-table
          ref="multipleTable"
          :data="tpoicList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px"
          border
        >
          <el-table-column label="序号" type="index" width="80px" center="true">
          </el-table-column>
          <el-table-column prop="title" label="题目" width="width">
          </el-table-column>
          <el-table-column prop="openingTeacher" label="开题教师" width="width">
          </el-table-column>
          <el-table-column prop="topicStatus" label="选题状态" width="width">
          </el-table-column>
          <el-table-column
            prop="specialized"
            label="题目所属专业"
            width="width"
          >
          </el-table-column>
          <el-table-column label="操作" width="250px" :center="true">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-check"
                @click="chooseTpoic(row.id)"
                >勾选</el-button
              >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-close"
                @click="cancelTpoic(row.id)"
                >取消勾选</el-button
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
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Selection",
  data() {
    return {
      search: "",
      dialogFormVisible: false,
      page: 1,
      limit: 3,
      total: 0,
      tpoicList: [],
    };
  },
  methods: {
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
    async chooseTpoic(tpoicId) {
      try {
        let result = await this.$API.student.reqChooseTpoic(tpoicId);
        if (result.code == 200) {
          this.$message({ type: "success", message: "选题勾选成功" });
          this.getTpociList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async cancelTpoic(tpoicId) {
      try {
        let result = await this.$API.student.reqCancleTpoic(tpoicId);
        if (result.code == 200) {
          this.$message({ type: "success", message: "取消勾选该选题" });
          this.getTpociList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async searchTpoic() {
      try {
        const { search } = this;
        this.tpoicList = this.tpoicList.filter((item) => {
          if (item.title.indexOf(search) !== -1) {
            return item;
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    clearSearch() {
      this.getTpociList();
    },
  },

  mounted() {
    this.getTpociList();
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
.tabel-content {
  margin-right: 40px;
}
</style>
