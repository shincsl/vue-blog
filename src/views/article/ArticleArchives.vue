<template>
  <div id="articleArchive">
    <div class="archive-banner banner">
      <h1 class="banner-title">归档</h1>
    </div>
    <el-row type="flex" justify="center" class="home-container">
      <el-col :span="16">
        <el-card class="blog-container">
          <p style="padding-left: 60px;font-size: 25px">目前共计{{ count }}篇文章</p>
          <el-timeline style="margin-left: 30px;margin-top: 40px">
            <el-timeline-item
                v-for="item in archiveList"
                :key="item.id" placement="top"
                size="large"
                :timestamp="item.createTime | formatDate">
              <a @click="view(item.id)" style="font-weight: 600;font-size: 20px" v-html="item.title"></a>
              <el-divider></el-divider>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {formatDate} from '../../utils/date'

export default {
  name: "ArticleArchives",
  data() {
    return {
      archiveList: [],
    };
  },
  created() {
    this.getArchiveList();
  },
  methods: {
    getArchiveList() {
      this.$store.dispatch("getArticles").then(res => {
        this.archiveList = res.data;
        console.log(res.data);
      });
    },
    view(id) {
      this.$router.push({path: `/articles/${id}`})
    }
  },
  filters: {
    formatDate(time) {
      // 秒处理为毫秒
      // time = time * 1000
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
  },
  computed:{
    count() {
      return this.archiveList.length;
    }
  }
}
</script>

<style scoped>
#articleArchive {
  width: 100%;
  background: linear-gradient(-45deg, #CCFFFF, #FFCCCC,#23a6d5, #23d5ab);
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
.archive-banner {
  background: url("../../assets/img/archive.jpg") center center / cover no-repeat;
  background-color: #49b1f5;
  animation: header-effect 1s;
  overflow : hidden;
}

.time {
  font-size: 0.75rem;
  color: #555;
  margin-right: 1rem;
}

.blog-container {
  min-width: 50%;
  max-width: 900px;
  padding: 10px 5px;
  border-radius: 5px;
  margin-bottom: 100px;
}
</style>