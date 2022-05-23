<template>
  <div class="me-view-body" :data-title="title">
    <el-container class="me-view-container">
      <el-main>
        <div class="me-view-card">
          <h1 class="me-view-title">{{article.title}}</h1>
          <div class="me-view-author">
            <a class="">
              <img class="me-view-picture" :src="avatar">
            </a>
            <div class="me-view-info">
              <span>{{article.author}}</span>
              <div class="me-view-meta">
                <span>{{article.createTime | format}}</span>&nbsp;
                <span>阅读   {{article.viewCounts}}</span>
              </div>

            </div>
            <el-button
                v-if="this.article.author.id == this.$store.state.id"
                @click="editArticle()"
                style="position: absolute;left: 60%;"
                size="mini"
                round
                icon="el-icon-edit">编辑</el-button>
          </div>
          <div class="me-view-content">
            <markdown-editor :editor=article.editor></markdown-editor>
          </div>

          <div class="me-view-end">
            <el-alert
                type="success"
                :closable="false">
              <ul slot="title" style="font-size: 1em">
                <li>文章作者：{{article.author}}</li>
                <li>文章发表于：{{article.createTime | format}}</li>
                <li>文章最后更新：{{article.updateTime | format}}</li>
                <li>文章阅读量：{{article.viewCounts}}</li>
              </ul>
            </el-alert>
          </div>

          <div class="me-view-tag">
            标签：
            <!--<el-tag v-for="t in article.tags" :key="t.id" class="me-view-tag-item" size="mini" type="success">{{t.tagName}}</el-tag>-->
            <el-button @click="tagOrCategory('tag', t.id)" size="mini" type="primary" v-for="t in article.tags" :key="t.id" round plain>{{t.tagName}}</el-button>
          </div>

          <div class="me-view-tag">
            文章分类：
            <!--<span style="font-weight: 600">{{article.category.categoryName}}</span>-->
            <el-button @click="tagOrCategory('category', article.category.id)" size="mini" type="primary" round plain>{{article.category.categoryName}}</el-button>
          </div>

          <div class="me-view-comment">
            <div class="me-view-comment-write">
              <el-row :gutter="20">
                <el-col :span="2">
                  <a class="">
                    <img class="me-view-picture" :src="avatar">
                  </a>
                </el-col>
                <el-col :span="19">
                  <el-input
                      type="textarea"
                      :autosize="{ minRows: 2}"
                      placeholder="你的评论..."
                      class="me-view-comment-text"
                      v-model="comment.content"
                      resize="none">
                  </el-input>
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" class="publish-button" @click="publishComment()"><div style="margin-bottom: 5px;margin-top: -3px">发表</div>评论</el-button>
                </el-col>
              </el-row>
            </div>

            <CommentItem
                v-for="(c,index) in comments"
                :comment="c"
                :articleId="article.id"
                :index="index"
                :rootCommentCounts="comments.length"
                :key="c.id">
            </CommentItem>

          </div>

        </div>
      </el-main>

    </el-container>
  </div>
</template>

<script>
import MarkdownEditor from "../../components/markdown/MarkdownEditor";
import CommentItem from "../../components/comment/CommentItem";
import {viewArticle} from "../../api/article";
import {getCommentsByArticle, publishComment} from '../../api/comment'
import default_avatar from '../../assets/img/default_avatar.png'

export default {
  name: 'ArticleView',
  created() {
    this.getArticle()
  },
  watch: {
    '$route': 'getArticle'
  },
  data() {
    return {
      article: {
        id: '',
        title: '',
        viewCounts: 0,
        summary: '',
        author: {},
        avatar: '',
        tags: [],
        category:{},
        createTime: '',
        updateTime: '',
        editor: {
          value: '',
          toolbarsFlag: false,
          subfield: false,
          defaultOpen: 'preview'
        }
      },
      comments: [],
      comment: {
        article: {},
        content: ''
      }
    }
  },
  computed: {
    avatar() {
      let avatar = this.article.avatar
      if (avatar.length > 0) {
        return avatar
      }
      return default_avatar
    },
    title() {
      return `${this.article.title} - 文章`
    }
  },
  methods: {
    tagOrCategory(type, id) {
      this.$router.push({path: `/${type}/${id}`})
    },
    editArticle() {
      this.$router.push({path: `/write/${this.article.id}`})
    },
    getArticle() {
      let that = this
      viewArticle(that.$route.params.id).then(res => {
        Object.assign(that.article, res.data.data)
        that.article.editor.value = res.data.data.body.content
        console.log(that.article)
        that.getCommentsByArticle()
      }).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: '文章加载失败', showClose: true})
        }
      })
    },
    publishComment() {
      let that = this
      if (!that.comment.content) {
        return;
      }
      that.comment.article.id = that.article.id
      let parms = {articleId:that.article.id,content:that.comment.content}
      publishComment(parms,this.$store.state.token).then(res => {
        if(res.data.success){
          that.$message({type: 'success', message: '评论成功', showClose: true})
          that.comment.content = ''
          that.comments.unshift(res.data.data)
        }else{
          that.$message({type: 'error', message: res.data.msg, showClose: true})
        }

      }).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: '评论失败', showClose: true})
        }
      })
    },

    getCommentsByArticle() {
      let that = this
      getCommentsByArticle(that.article.id).then(res => {
        if(res.data.success){
          that.comments = res.data.data
        }else{
          that.$message({type: 'error', message: '评论加载失败', showClose: true})
        }
      }).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: '评论加载失败', showClose: true})
        }
      })
    },
  },
  components: {
    'markdown-editor': MarkdownEditor,
    CommentItem
  },
  //组件内的守卫 调整body的背景色
  beforeRouteEnter(to, from, next) {
    window.document.body.style.backgroundColor = '#fff';
    next();
  },
  beforeRouteLeave(to, from, next) {
    window.document.body.style.backgroundColor = '#f5f5f5';
    next();
  }
}
</script>

<style>
.me-view-body {
  margin: 100px auto 140px;
}

.me-view-container {
  width: 800px;
}

.el-main {
  overflow: hidden;
}

.me-view-title {
  font-size: 34px;
  font-weight: 800;
  line-height: 1.3;
  text-align: center;
}

.me-view-author {
  /*margin: 30px 0;*/
  margin-top: 30px;
  vertical-align: middle;
}

.me-view-picture {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
  vertical-align: middle;
  background-color: #5fb878;
}

.me-view-info {
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
}

.me-view-meta {
  font-size: 12px;
  color: #969696;
}

.me-view-end {
  margin-top: 20px;
}

.me-view-tag {
  margin-top: 20px;
  padding-left: 6px;
  border-left: 4px solid #c5cac3;
}

.me-view-tag-item {
  margin: 0 4px;
}

.me-view-comment {
  margin-top: 60px;
}

.me-view-comment-title {
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
}

.me-view-comment-write {
  margin-top: 20px;
}

.me-view-comment-text {
  font-size: 16px;
}

.publish-button {
  height: 54px;
}
</style>
