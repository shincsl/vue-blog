<template>
  <scroll-page :loading="loading" :offset="offset" :no-data="noData" v-on:load="load">
    <div>
      <el-input placeholder="请输入内容" v-model="keyword" @keyup.enter.native="getSearchArticles" class="input-with-select" prefix-icon="el-icon-search">
        <el-button @click="getSearchArticles" slot="append" icon="el-icon-search" class="search-btn"
                   style="background:rgba(73,177,245,0.9);color: #fff"></el-button>
      </el-input>
    </div>
    <article-item v-for="article in articles" :key="article.id" v-bind="article">
    </article-item>
  </scroll-page>
</template>

<script>
import ArticleItem from './Article'
import ScrollPage from '../scrollPage'
import {getArticles, getSearchArticles} from "../../api/article";

export default {
  name: "ArticleScrollPage",
  props: {
    offset: {
      type: Number,
      default: 0
    },
    page: {
      type: Object,
      default() {
        return {}
      }
    },
    query: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    'query': {
      handler() {
        this.noData = false
        this.articles = []
        this.innerPage.pageNumber = 1
        if (this.isSearch) {
          this.getSearchArticles()
        } else {
          this.getArticles()
        }
      },
      deep: true
    },
    'page': {
      handler() {
        this.noData = false
        this.articles = []
        this.innerPage = this.page
        if (this.isSearch) {
          this.getSearchArticles()
        } else {
          this.getArticles()
        }
      },
      deep: true
    }
  },
  created() {
    this.getArticles()
  },
  data() {
    return {
      loading: false,
      noData: false,
      //分页信息
      innerPage: {
        pageSize: 5,
        page: 1,
        pageNo: 1
      },
      //文章列表
      articles: [],
      keyword: "",//搜索关键字
      tempKey: "",//临时关键字 用于判断是否初次搜索该关键字
      searchArticles: [],//es搜索结果
      isSearch: false // 是否是搜索
    }
  },
  methods: {
    load() {
      //下拉触发分页的时候 进行接口加载
      if (this.isSearch) {
        this.getSearchArticles()
      } else {
        this.getArticles()
      }
    },
    getArticles() {
      let that = this
      that.loading = true
      getArticles(that.query, that.innerPage).then((res) => {
        if (res.data.success) {
          if (res.data.data.length <= 0) {
            that.noData = true;
          } else {
            this.innerPage.page += 1;
            this.articles = this.articles.concat(res.data.data);
          }
        } else {
          that.$message({type: 'error', message: res.data.message, showClose: true})
        }
      }).catch(() => {
        //有报错
        that.$message({type: 'error', message: '文章加载失败!', showClose: true})
      }).finally(() => {
        this.loading = false;
      });
    },
    getSearchArticles() {
      let that = this
      that.loading = true
      if (this.keyword == null || this.keyword == "") {
        this.isSearch = false
        this.articles = []
        this.innerPage.page = 1
        this.noData = false
        this.tempKey = ""
        this.getArticles()
      } else {
        if (this.tempKey != this.keyword) {
          this.searchArticles = []
          this.innerPage.pageNo = 1
          this.noData = false
          this.tempKey = this.keyword
        }
        that.isSearch = true
        getSearchArticles(that.keyword, that.innerPage).then((res) => {
          if (res.data.data.length <= 0) {
            that.noData = true;
            if (this.searchArticles.length <= 0) {
              this.articles = []
            }
          } else {
            that.innerPage.pageNo += 1;
            this.searchArticles = this.searchArticles.concat(res.data.data);
            console.log("search:",this.searchArticles)
            this.articles = this.searchArticles;
            console.log("articles:",this.articles)
          }
        }).catch(() => {
          //有报错
          that.$message({type: 'error', message: '文章加载失败!', showClose: true})
        }).finally(() => {
          this.loading = false;
        });
      }
    }
  },
  components: {
    'article-item': ArticleItem,
    'scroll-page': ScrollPage
  }

}
</script>

<style>
.search-btn {
  text-align: center;
  z-index: 1;
  font-size: 14px;
  position: relative;
  display: block;
  background-color: #49b1f5;
  color: #fff !important;
  line-height: 32px;
  transition-duration: 1s;
  transition-property: color;
}

.search-btn:before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: #ff7242;
  content: "";
  transition-timing-function: ease-out;
  transition-duration: 0.5s;
  transition-property: transform;
  transform: scaleX(0);
  transform-origin: 0 50%;
}

.search-btn:hover:before {
  transition-timing-function: cubic-bezier(0.45, 1.64, 0.47, 0.66);
  transform: scaleX(1);
}
</style>