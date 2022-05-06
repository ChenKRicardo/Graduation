<template>
  <div class="dashboard-container">
    <div class="dashboard-text">用户角色: {{ roles }}</div>
    <small>Welcome back, {{ roles }}</small>
    <el-row :gutter="20" style="margin: 20px" class="HomeCard">
      <el-col :span="4">
        <router-link to="/Acount/teacher">
          <el-card class="card account">
            <i class="el-icon-s-custom"></i>
            <span class="font">账号管理</span>
          </el-card>
        </router-link>
      </el-col>
      <el-col :span="4">
        <router-link to="/selection/selection">
          <el-card class="card choose">
            <i class="el-icon-document"></i>
            <span class="font">选题管理</span>
          </el-card>
        </router-link>
      </el-col>
      <el-col :span="6">
        <router-link to="/doucment/openingReport">
          <el-card class="card document">
            <i class="el-icon-s-order"></i>
            <span class="font">过程文档管理</span>
          </el-card>
        </router-link>
      </el-col>
      <el-col :span="4">
        <router-link to="/replay/replay">
          <el-card class="card replay">
            <i class="el-icon-chat-round"></i>
            <span class="font">毕设答辩</span>
          </el-card>
        </router-link>
      </el-col>
      <el-col :span="4">
        <router-link to="/grade/score">
          <el-card class="card score">
            <i class="el-icon-document-checked"></i>
            <span class="font">成绩管理</span>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["roles"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
.HomeCard {
  cursor: pointer;
  i,
  span {
    font-size: 25px;
    color: #fff;
  }
  .account {
    background: #ffc333;
    height: 100px;
  }
  .choose {
    background: #f391a9;
    height: 100px;
  }
  .document {
    height: 100px;
    background: #48a75b;
  }
  .replay {
    height: 100px;
    background: #409eff;
  }
  .score {
    height: 100px;
    background: #9b95c9;
  }
}
</style>
