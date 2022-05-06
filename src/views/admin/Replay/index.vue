<template>
  <div class="Replay">
    <div class="Replay-text"><h3>毕设答辩</h3></div>
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
        <el-button type="success" @click="createGroup">创建分组</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <!-- 表格 -->
      <div class="tabel-content">
        <el-table
          ref="multipleTable"
          :data="replyMenu"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px"
          border
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="序号" type="index" width="80px" center="true">
          </el-table-column>
          <el-table-column prop="studentName" label="参辩学生" width="width">
          </el-table-column>
          <el-table-column prop="teacherName" label="参辩教师" width="width">
          </el-table-column>
          <el-table-column prop="position" label="答辩地点" width="120px">
          </el-table-column>
          <el-table-column prop="time" label="答辩时间" width="width">
          </el-table-column>
          <el-table-column label="操作" width="300px" :center="true">
            <template>
              <el-button type="warning" size="mini" icon="el-icon-edit" @click="editReplay"
                >修改</el-button
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
        :page-sizes="[3, 5, 10]"
        :page-size="3"
        layout=" prev, pager, next, jumper,->,total, sizes"
        :total="20"
      >
      </el-pagination>
      <!-- Dialog -->
      <el-dialog :title="dialogTitle==true?'创建答辩分组':'修改答辩分组'" :visible.sync="dialogFormVisible">
        <el-form ref="form" label-width="80px">
          <el-form-item label="参辩学生">
            <el-select value="" placeholder="请选择参辩学生">
              <el-option label="陈康" value="陈康"></el-option>
              <el-option label="磁卡" value="磁卡"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参辩教师">
            <el-select value="" placeholder="请选择参辩教师">
              <el-option label="甘老师" value="甘老师"></el-option>
              <el-option label="邓老师" value="邓老师"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="答辩地点">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="答辩时间">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker
                placeholder="选择时间"
                style="width: 100%"
              ></el-time-picker>
            </el-col>
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
  name: "Replay",
  data() {
    return {
      replyMenu: [
        {
          studentName: "陈康",
          teacherName: "甘老师",
          position: "明志楼301",
          time: "2022年-4月-15日",
        },
      ],
      search: "",
      dialogFormVisible: false,
      dialogTitle:true
    };
  },
  methods:{
    //创建答辩分组
    createGroup(){
      this.dialogTitle = true
      this.dialogFormVisible = true
    },
    //修改答辩分组
    editReplay(){
      this.dialogTitle = false
      this.dialogFormVisible = true
    }
  }
};
</script>

<style lang="scss" scoped>
.Replay {
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
