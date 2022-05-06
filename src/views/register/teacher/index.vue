<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      class="login-form"
      :model="RegisterForm"
      :rules="registerRules"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">教师注册</h3>
      </div>
      <!-- 姓名 -->
      <el-form-item prop="teacherName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="teacherName"
          placeholder="teacherName"
          v-model="RegisterForm.teacherName"
          name="teacherName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 职工号 -->
      <el-form-item prop="userID">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userID"
          placeholder="userID"
          v-model="RegisterForm.userID"
          name="userID"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          :type="passwordType"
          v-model="RegisterForm.password"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <!-- 学院 -->
      <el-form-item>
        <el-select
          v-model="RegisterForm.academy"
          placeholder="请选择学院"
          style="width: 118%"
        >
          <el-option
            v-for="(academy, index) in academyList"
            :key="index"
            :label="academy.label"
            :value="academy.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 职称 -->
      <el-form-item>
        <el-select
          v-model="RegisterForm.jobTitle"
          placeholder="请选择职称"
          style="width: 118%"
        >
          <el-option
            v-for="(jobTitle, index) in jobTitleList"
            :key="index"
            :label="jobTitle.label"
            :value="jobTitle.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 电话 -->
      <el-form-item prop="phone">
        <el-input
          ref="phone"
          placeholder="phone"
          v-model="RegisterForm.phone"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item prop="mailbox">
        <el-input
          ref="mailbox"
          placeholder="mailbox"
          v-model="RegisterForm.mailbox"
          name="mailbox"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click="teacherRegister"
        >注册</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  name: "StudentRegister",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 && value.length > 10) {
        callback(new Error("密码长度必须在6-10位"));
      } else {
        callback();
      }
    };
    return {
      RegisterForm: {
        teacherName: "",
        userID: "",
        password: "",
        academy: "",
        jobTitle: "",
        phone: "",
        mailbox: "",
      },
      academyList: [
        {
          value: "人工智能学院",
          label: "人工智能学院",
        },
        {
          value: "人居环境学院",
          label: "人居环境学院",
        },
        {
          value: "新能源车辆学院",
          label: "新能源车辆学院",
        },
      ],
      jobTitleList: [
        {
          value: "讲师",
          label: "讲师",
        },
        {
          value: "助教",
          label: "助教",
        },
        {
          value: "教授",
          label: "教授",
        },
      ],
      registerRules: {
        teacherName: [{ required: true, trigger: "blur" }],
        userID: [{ required: true, trigger: "blur" }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        academy: [{ required: true, trigger: "blur" }],
        jobTitle: [{ required: true, trigger: "blur" }],
        phone: [{ required: true, trigger: "blur" }],
        mailbox: [{ required: true, trigger: "blur" }],
      },
      loading: false,
      passwordType: "password",
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    async teacherRegister() {
      const { RegisterForm } = this;
      try {
        let result = await this.$API.teacher.reqTeacherRegister(RegisterForm);
        if (result.code == 200) {
          this.$router.push({ path: "/login" });
          this.$message({
            message: "注册成功",
            type: "success",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.register {
  float: right;
  a > span {
    color: rgb(255, 255, 255);
    font-size: 14px;
    margin: 10px;
  }
  span:hover {
    color: rgb(73, 187, 187);
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
