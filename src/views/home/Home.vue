<template>
  <el-main class="me-container">
    <!-- 主页文章 -->

    <div class="home-banner">
      <div class="banner-container">
        <!-- 联系方式 -->
        <h1 class="blog-title animated zoomIn">
          Shin的个人博客
        </h1>
        <!-- 打字效果 随机输出一句话 -->
        <div class="blog-intro">
          {{ obj.output }} <span class="typed-cursor">|</span>
        </div>
      </div>
      <!-- 向下滚动 -->
      <div class="scroll-down" @click="scrollDown">
        <i color="#fff" class="el-icon-arrow-down"></i>
      </div>
    </div>
    <el-row class="home-container">
      <el-col :offset="2">
        <el-container>
          <el-main>
            <ArticleScrollPage></ArticleScrollPage>
          </el-main>
          <el-aside>
            <CardInfo></CardInfo>
          </el-aside>
        </el-container>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import EasyTyper from "easy-typer-js";
import ArticleScrollPage from "../../components/article/ArticleScrollPage";
import CardInfo from "../card/CardInfo";

export default {
  components: {
    ArticleScrollPage,
    CardInfo
  },
  created() {
    this.init();
  },
  data: function () {
    return {
      obj: {
        output: "",
        isEnd: false,
        speed: 300,
        singleBack: false,
        sleep: 0,
        type: "rollback",
        backSpeed: 40,
        sentencePause: true
      },
    };
  },
  methods: {
    // 初始化
    init() {
      document.title = this.$route.meta.title;
      // 一言Api进行打字机循环输出效果
      fetch("https://v1.hitokoto.cn?c=i")
          .then(res => {
            return res.json();
          })
          .then(({hitokoto}) => {
            this.initTyped(hitokoto);
          });
    },
    initTyped(input, fn, hooks) {
      const obj = this.obj;
      // eslint-disable-next-line no-unused-vars
      const typed = new EasyTyper(obj, input, fn, hooks);
    },
    scrollDown() {
      window.scrollTo({
        behavior: "smooth",
        top: document.documentElement.clientHeight
      });
    },
  },
  computed: {}
};
</script>

<style lang="stylus">
.typed-cursor
  opacity: 1
  animation: blink 0.7s infinite

@keyframes blink
  0%
    opacity: 1
  50%
    opacity: 0
  100%
    opacity: 1
</style>

<style scoped>
.me-container{
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
.home-banner {
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  height: 100vh;
  background: url("../../assets/img/beijing01.jpg") center center / cover no-repeat;
  background-color: #49b1f5;
  background-attachment: fixed;
  text-align: center;
  color: #fff !important;
  animation: header-effect 1s;
}

.banner-container {
  margin-top: 43vh;
  line-height: 1.5;
  color: #eee;
}

.blog-contact a {
  color: #fff !important;
}

@media (min-width: 760px) {
  .blog-title {
    font-size: 2.5rem;
  }

  .blog-intro {
    font-size: 1.5rem;
  }

  .home-container {
    max-width: 1200px;
    margin: calc(100vh - 48px) auto 50px auto;
    padding: 0 5px;
  }

}

@media (max-width: 759px) {
  .blog-title {
    font-size: 26px;
  }

  .home-container {
    width: 100%;
    margin: calc(100vh - 66px) auto 0 auto;
  }


  .article-cover div {
    border-radius: 8px 8px 0 0 !important;
  }

}

.scroll-down {
  cursor: pointer;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.scroll-down i {
  font-size: 2rem;
}

.article-wrapper a:hover {
  color: #8e8cd8;
}

.article-info a {
  font-size: 95%;
  color: #858585 !important;
}

.blog-info-data a {
  text-decoration: none;
}

@keyframes scroll-down-effect {
  0% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
  50% {
    top: -16px;
    opacity: 1;
    filter: none;
  }
  100% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
}

.big i {
  color: #f00;
  animation: big 0.8s linear infinite;
}

@keyframes big {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.el-container {
  width: 1050px;
}

.el-aside {
  margin-left: 20px;
  width: 260px;
}

.el-main {
  padding: 0px;
  line-height: 16px;
}

.el-card {
  border-radius: 0;
}

.el-card:not(:first-child) {
  margin-top: 20px;
}
</style>
