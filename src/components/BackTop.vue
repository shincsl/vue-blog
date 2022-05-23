<template>
  <div @mouseenter="showAll(true)" @mouseleave="showAll(false)">
    <div class="rightshow" :style="isShow2">
      <i v-if="showType" class="el-icon-arrow-right show"/>
      <i v-else class="el-icon-arrow-left show"/>
    </div>
    <div class="rightside" :style="isShow">
      <template v-if="!user.login">
        <el-tooltip class="item" effect="light" content="登录" placement="left">
          <i class="iconfont me-header-picture icondenglu" @click="openLogin"/>
        </el-tooltip>
      </template>
      <template v-else>
        <el-popover
            placement="left"
            popper-class="popperOptions"
            trigger="hover">
          <img class="me-header-picture" :src="user.avatar" slot="reference" alt=""/>
          <a @click="logout">
            <i class="el-icon-back"></i>退出
          </a>
        </el-popover>
      </template>
      <el-tooltip class="item" effect="light" content="首页" placement="left">
        <i @click="jumpTo('/')" class="iconfont rightside-icon iconzhuye"/>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="写文章" placement="left">
        <i @click="jumpTo('/write')" class="iconfont rightside-icon iconzhifeiji"/>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="文章分类" placement="left">
        <i @click="jumpTo('/category/all')" class="iconfont rightside-icon iconfenlei"/>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="标签" placement="left">
        <i @click="jumpTo('/tag/all')" class="iconfont rightside-icon iconbiaoqian"/>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="搜索文章" placement="left">
        <i @click="backTo('search')" class="iconfont rightside-icon iconsousuo"/>
      </el-tooltip>
      <div class="setting-container" @click="show">
        <i class="iconfont iconshezhi setting"/>
      </div>
      <i @click="backTo('top')" class="iconfont rightside-icon iconziyuanldpi"/>
      <div :class="'rightside-config-hide ' + isOut">
        <i :class="'iconfont rightside-icon ' + icon" @click="check"/>
      </div>
    </div>

  </div>
</template>

<script>
import { initTheme } from '../utils/theme';
export default {
  mounted() {
    window.addEventListener("scroll", this.scrollToTop);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  },
  created() {
    initTheme(this.theme);
  },
  data: function () {
    return {
      isShow: "",
      isShow2: "",
      isOut: "rightside-out",
      icon: "iconyueliang",
      showType: true,
      theme: 'light',
    };
  },
  computed: {
    user() {
      let login = this.$store.state.account.length != 0;
      let avatar = this.$store.state.avatar;
      return {
        login, avatar
      }
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(res => {
        this.$store.state.articles = []
        this.$store.state.categories = []
        this.$store.state.tags = []
        this.$message({message: '注销成功', type: 'success', showClose: true});
      }).catch(error => {
        if (error != 'error') {
          this.$message({message: error, type: 'error', showClose: true});
        }
      })
    },
    // 打开登录弹窗
    openLogin() {
      this.$store.state.loginFlag = true;
    },
    // 跳转到指定页面
    jumpTo(url) {
      this.$router.push(url);
    },
    // 回到顶部方法
    backTo(to) {
      if (to === "top") {
        window.scrollTo({
          behavior: "smooth",
          top: 0
        });
      } else {
        window.scrollTo({
          behavior: "smooth",
          top: 520
        });
      }
    },
    // 为了计算距离顶部的高度，当高度大于100显示回顶部图标，小于100则隐藏
    scrollToTop() {
      const that = this;
      let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 50) {
        this.showType = false;
        that.isShow = "opacity: 1;transform: translateX(-38px);";
        that.isShow2 = "transform: translateX(-74px);";
      } else {
        this.showType = true;
        that.isShow = "";
        that.isShow2 = "transform: translateX(-38px);";
      }
    },
    show() {
      const flag = this.isOut == "rightside-out";
      this.isOut = flag ? "rightside-in" : "rightside-out";
    },
    showAll(type) {
      if (type === true) {
        this.showType = false;
        this.isShow = "opacity: 1;transform: translateX(-38px);";
        this.isShow2 = "transform: translateX(-74px);";
      }else {
        this.showType = true;
        this.isShow = "";
        this.isShow2 = "transform: translateX(-38px);";
      }
    },
    check() {
      const flag = this.icon == "iconyueliang";
      this.icon = flag ? "icontaiyang" : "iconyueliang";
      this.theme == 'light' ? (this.theme = 'dark') : (this.theme = 'light');
      initTheme(this.theme);
    }
  }
};
</script>

<style>
.rightside {
  z-index: 1024;
  position: fixed;
  right: -34px;
  bottom: 150px;
  transition: all 0.5s;
}

.rightside-config-hide {
  transform: translate(38px, 0);
}

.rightside-out {
  animation: rightsideOut 0.3s;
}

.rightside-in {
  transform: translate(0, 0) !important;
  animation: rightsideIn 0.3s;
}

.rightside-icon,
.setting-container {
  display: block;
  margin-bottom: 2px;
  width: 30px;
  height: 30px;
  background-color: #49b1f5;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
  transition: all 0.5s;
}

.rightside-icon:hover,
.setting-container:hover {
  background-color: #ff7242;
  transform: rotate(360deg);
}

.setting-container i {
  display: block;
  animation: turn-around 2s linear infinite;
}

@keyframes turn-around {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rightsideOut {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(30px, 0);
  }
}

@keyframes rightsideIn {
  0% {
    transform: translate(30px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}

.me-header-picture {
  width: 36px;
  height: 36px;
  display: block;
  margin-bottom: 2px;
  background-color: #49b1f5;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 35px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 50%;
  vertical-align: middle;
  position: fixed;
  top: -42px;
  left: -5px;
  transition: all 0.5s;
}

.me-header-picture:hover {
  background-color: #ff7242;
  transform: rotate(360deg);
}

.rightshow {
  z-index: 1024;
  position: fixed;
  right: -38px;
  bottom: 45%;
  transition: all 0.5s;
}

.rightshow-config-hide {
  transform: translate(38px, 0);
}

.rightshow-out {
  animation: rightsideOut 0.3s;
}

.rightshow-in {
  transform: translate(0, 0) !important;
  animation: rightsideIn 0.3s;
}

.el-icon-arrow-right {
  font-size: 26px;
  cursor: pointer;
  border: 1px dashed #ddd;
  color: #49b1f5;
}
.el-icon-arrow-right:hover {
  color: #ff7242;
  border: 1px solid #ff7242;
}

.el-icon-arrow-left {
  font-size: 26px;
  cursor: pointer;
  border: 1px solid #ddd;
  color: #49b1f5;
}
.el-icon-arrow-left:hover {
  color: #ff7242;
  border: 1px solid #ff7242;
}
</style>
