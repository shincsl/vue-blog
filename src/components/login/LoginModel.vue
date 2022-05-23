<template>
  <el-dialog
      :visible.sync="loginFlag"
      width="30%"
      :modal-append-to-body='false'
      :close-on-click-modal='false'
      @close="closeDialog('userForm')">
    <div class="me-login-box me-login-box-radius">
      <el-form ref="userForm" :model="userForm" :rules="rules">
        <el-form-item label="用户名" prop="account" clearable>
          <el-input placeholder="请输入您的用户名" v-model="userForm.account"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password" style="padding-top: 20px">
          <el-input placeholder="请输入您的密码" type="password" v-model="userForm.password"
                    @keyup.enter.native="login('userForm')" show-password></el-input>
        </el-form-item>

        <el-form-item size="medium" class="me-login-button">
          <el-button type="primary" @click.native.prevent="login('userForm')">登录</el-button>
        </el-form-item>
      </el-form>
      <!-- 注册和找回密码 -->
      <div>
        <el-link :underline="false" @click="openRegister">立即注册</el-link>
        <el-link :underline="false" @click="forgetFlag=true" style="float: right">忘记密码?</el-link>
      </div>
      <div class="social-login-title">社交账号登录</div>
      <div class="social-login-wrapper">
        <!-- 微博登录 -->
        <a
            class="mr-3 iconfont iconweibo"
            style="color:#e05244"
        />
        <!-- qq登录 -->
        <a class="iconfont iconqq" style="color:#00AAEE"/>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "LoginModel",
  data() {
    return {
      userForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {max: 10, message: '不能大于10个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {max: 10, message: '不能大于10个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    openRegister() {
      this.$store.state.loginFlag = false;
      this.$store.state.registerFlag = true;
    },
    openForget() {
      this.$store.state.loginFlag = false;
      this.$store.state.forgetFlag = true;
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields();
    },
    login(formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.$store.dispatch('login', that.userForm).then(() => {
            that.$store.dispatch("getUserInfo").then(() => {
              that.$store.dispatch("getArticles").then();
              that.$store.dispatch("getAllCategories").then();
              that.$store.dispatch("getAllTags").then();
              that.$store.commit("closeModel");
              that.$message({message: '登录成功', type: 'success', showClose: true});
            });
          }).catch((error) => {
            if (error !== 'error') {
              that.$message({message: error, type: 'error', showClose: true});
            }
          })
        } else {
          return false;
        }
      });
    },
  },
  computed: {
    loginFlag: {
      set(value) {
        this.$store.state.loginFlag = value;
      },
      get() {
        return this.$store.state.loginFlag;
      }
    },
  }
}
</script>

<style scoped>

</style>