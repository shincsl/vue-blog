<template>
  <div>
    <el-dialog
        :visible.sync="registerFlag"
        width="30%"
        :modal-append-to-body='false'
        :close-on-click-modal='false'
        @close="closeRegDialog('userFormRegister')">
      <div class="me-register-box">
        <el-form ref="userFormRegister" :model="userFormRegister" :rules="rules">
          <el-form-item label="用户名" prop="account">
            <el-input placeholder="用户名" v-model="userFormRegister.account" clearable></el-input>
          </el-form-item>

          <el-form-item label="昵称" prop="nickname" style="padding-top: 20px">
            <el-input placeholder="昵称" v-model="userFormRegister.nickname"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password" style="padding-top: 20px">
            <el-input placeholder="密码" type="password" v-model="userFormRegister.password"
                      @keyup.enter.native="register('userFormRegister')" show-password></el-input>
          </el-form-item>

          <el-form-item size="medium" style="text-align: center">
            <el-button type="danger" style="width: 100%" @click.native.prevent="register('userFormRegister')">注册
            </el-button>
          </el-form-item>

          <el-form-item size="medium" class="me-login-button">
            <div>
              已有账号？
              <el-link :underline="false" @click="openLogin">登录</el-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RegisterModel",
  data() {
    return {
      userFormRegister: {
        account: '',
        nickname: '',
        password: ''
      },
      rules: {
        account: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {max: 10, message: '不能大于10个字符', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
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
    openLogin() {
      this.$store.state.registerFlag = false;
      this.$store.state.loginFlag = true;
    },
    closeRegDialog(formName) {
      this.$refs[formName].resetFields();
    },
    register(formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.$store.dispatch('register', that.userFormRegister).then(() => {
            that.$store.dispatch("getUserInfo").then(() => {
              that.$store.commit("closeModel");
              that.$message({message: '注册成功', type: 'success', showClose: true});
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
    registerFlag: {
      set(value) {
        this.$store.state.registerFlag = value;
      },
      get() {
        return this.$store.state.registerFlag;
      }
    },
  }
}
</script>

<style scoped>

</style>