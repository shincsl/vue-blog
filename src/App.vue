<template>
  <div id="app">
    <el-container class="main-container">
      <!-- 内容 -->
      <router-view/>
      <base-footer v-show="footerShow"></base-footer>
      <!-- 返回顶部 -->
      <BackTop></BackTop>
    </el-container>
    <!-- 登录模态框 -->
    <LoginModel></LoginModel>
    <!-- 注册模态框 -->
    <RegisterModel></RegisterModel>
  </div>
</template>
<script>
import BackTop from "./components/BackTop";
import Footer from "./components/layout/footer/Footer";
import LoginModel from "./components/login/LoginModel";
import RegisterModel from "./components/login/RegisterModel";

export default {
  components: {
    BackTop,
    LoginModel,
    RegisterModel,
    'base-footer': Footer
  },
  data() {
    return {
      activeIndex: '/',
      footerShow: true
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.activeIndex = to.path
    })
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path == '/') {
      this.footerShow = true
    } else {
      this.footerShow = false
    }
    this.activeIndex = to.path
    next()
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}

body {
  background-color: #f5f5f5;
  font-weight: 400;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  line-height: 1.5;
}

#app {
  background: var(--fill-1);
}

.main-container {
  background: linear-gradient(-45deg, #CCFFFF, #FFCCCC, #CCFFFF, #FFCCCC);
  background-size: 400% 400%;
  animation: Gradient 10s ease infinite;
}
@keyframes Gradient {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

a {
  cursor: pointer;
  text-decoration: none;
  transition: none 86ms ease-out;
}

a:hover {
  color: #5FB878;
}

.me-area {
  background-color: #fff;
}

html {
  height: 100%;
}

body {
  min-height: 100%;
}

body {
  position: relative;
}
</style>
