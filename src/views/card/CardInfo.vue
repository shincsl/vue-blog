<template>
  <div>
    <el-card class="animated zoomIn blog-card mt-5">
      <!-- 退出按钮       -->
      <el-popconfirm
          placement="top"
          confirm-button-text='是的'
          cancel-button-text='点错了'
          icon="el-icon-info"
          icon-color="red"
          title="是否要退出登录？"
          @confirm="logout"
          v-show="user.login"
      >
        <div style="position: absolute;right: 40px;top: 20px;" slot="reference">
          <el-tooltip class="item" effect="dark" content="退出" placement="right-start">
            <a>
              <i class="el-icon-switch-button" style="color: pink;font-size: 20px;"></i>
            </a>
          </el-tooltip>
        </div>
      </el-popconfirm>
      <div class="author-wrapper">
        <!-- 博主头像 -->
        <div class="author-avatar">
          <el-avatar :size="80" class="avatar-img" fit="cover">
            <div v-if="user.login" class="avatar-info" @click="dialogAvatar = true">
              <p>更换头像</p>
            </div>
            <div v-else class="avatar-info" @click="openLogin">
              <p>未登录</p>
            </div>
            <img :src="user.avatar" slot="default" alt="">
          </el-avatar>
        </div>
        <div style="font-size: 1.375rem">{{ user.name }}</div>
      </div>
      <!-- 博客信息 -->
      <div class="blog-info-wrapper">
        <div class="blog-info-data">
          <router-link :to="'/archives/'+user.id">
            <div style="font-size: 0.875rem;color: #4c4948">文章</div>
            <div style="font-size: 1.25rem;color: #4c4948">{{ articles.length }}</div>
          </router-link>
        </div>
        <div class="blog-info-data">
          <router-link to="/category/all">
            <div style="font-size: 0.875rem;color: #4c4948">分类</div>
            <div style="font-size: 1.25rem;color: #4c4948">{{ categories.length }}</div>
          </router-link>
        </div>
        <div class="blog-info-data">
          <router-link to="/tag/all">
            <div style="font-size: 0.875rem;color: #4c4948">标签</div>
            <div style="font-size: 1.25rem;color: #4c4948">{{ tags.length }}</div>
          </router-link>
        </div>
      </div>
      <!-- 收藏按钮 -->
      <a class="collection-btn" @click="tip">
        <i class="el-icon-star-on" style="font-size: 18px;padding-right: 4px;"></i>加入书签
      </a>
      <div class="card-info-social">
        <a
            class="iconfont iconqq"
            target="_blank"
            href="http://wpa.qq.com/msgrd?v=3&uin=823091273&site=qq&menu=yes"
        />
        <a
            target="_blank"
            href="https://github.com/shincsl"
            class="ml-5 mr-5 iconfont icongithub"
        />
        <a
            target="_blank"
            href="https://gitee.com/shincsl"
            class="iconfont icongitee-fill-round"
        />
      </div>
    </el-card>

    <el-card class="blog-card animated zoomIn mt-5 big">
      <div class="web-info-title">
        <i class="el-icon-message-solid" style="font-size: 18px;padding-right: 2px;color: red"></i>公告
      </div>
      <div style="font-size:0.875rem">
        网站用于记录学习过程中的笔记、技术分享、生活点滴，欢迎大家踊跃参与，欢迎各位朋友提出建议。
      </div>
    </el-card>

    <el-card class="blog-card animated zoomIn mt-5 big" :body-style="{ padding: '8px 18px' }">
      <div slot="header" class="me-tag-header">
        <i class="el-icon-s-flag">最热标签</i>
      </div>

      <ul class="me-tag-list">
        <li class="me-tag-item" v-for="t in hotTags" :key="t.id">
          <!--type="primary"-->
          <el-button @click="tag(t.id)" size="mini" type="primary" round plain>{{ t.tagName }}</el-button>
        </li>
      </ul>
    </el-card>

    <el-dialog
        title="提示"
        :visible.sync="dialogAvatar"
        width="25%">
      <el-upload
          class="avatar-uploader"
          action=""
          :http-request="uploadAvatar"
          :multiple="false"
          ref='upload_ref'
          :auto-upload="false"
          list-type="picture"
          :on-change="fileChange"
          :file-list="fileList"
          :show-file-list="false">
        <img v-if="avatarUrl" :src="avatarUrl" class="updateAvatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAvatar = false">取 消</el-button>
        <el-button type="primary" @click="submitChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import {getHotTags} from '../../api/tag'

export default {
  name: 'CardInfo',
  data() {
    return {
      hotTags: [],
      dialogAvatar: false,
      avatarUrl: '',
      fileList: [],
    }
  },
  created() {
    this.getHotTags()
  },
  methods: {
    getHotTags() {
      let that = this
      getHotTags().then(res => {
        that.hotTags = res.data.data
      }).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: '最热标签加载失败!', showClose: true})
        }
      })
    },
    tag(id) {
      this.$router.push({path: `/tag/${id}`})
    },
    tip() {
      this.$message({
        showClose: true,
        message: '按CTRL+D 键将本页加入书签',
        duration: 2000,
        iconClass: 'el-icon-collection-tag'
      });
    },
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
    // 限制上传文件格式
    fileChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
      if (file.size / (1024 * 1024) > 5) {  // 限制文件大小
        this.$message.warning(`当前限制文件大小不能大于5M`)
        return false
      }
      let suffix = this.getFileType(file.name) //获取文件后缀名
      let suffixArray = ['jpg', 'png', 'jpeg', 'gif'] //限制的文件类型，根据情况自己定义
      if (suffixArray.indexOf(suffix) === -1) {
        this.$message({
          message: '图片格式错误，请选择jpg、png、jpeg、gif格式的图片！',
          type: 'error',
          duration: 4000
        })
        return this.avatarUrl = '';
      } else {
        this.avatarUrl = URL.createObjectURL(file.raw);
      }
    },
    getFileType(name) {
      let startIndex = name.lastIndexOf('.')
      if (startIndex !== -1) {
        return name.slice(startIndex + 1).toLowerCase()
      } else {
        return ''
      }
    },
    // 修改头像
    uploadAvatar(param) {
      let that = this
      let formData = new FormData();
      formData.append('image', param.file);

      let suffix = this.getFileType(param.file.name) //获取文件后缀名
      let suffixArray = ['jpg', 'png', 'jpeg', 'gif'] //限制的文件类型，根据情况自己定义
      if (suffixArray.indexOf(suffix) === -1) {
        this.$message({
          message: '请选择一张图片！',
          type: 'error',
          duration: 2000
        })
        return false
      }
      that.$store.dispatch('updateAvatar', formData).then((res) => {
        if (res.success) {
          that.avatarUrl = res.data.avatar;
          console.log("新头像地址：" + that.avatarUrl);
          that.$message({message: '更换头像成功', type: 'success', showClose: true});
          that.dialogAvatar = false;
        } else {
          that.$message({message: res.msg, type: 'error', showClose: true})
        }
      }).catch((error) => {
        if (error !== 'error') {
          that.$message({message: error, type: 'error', showClose: true});
        }
      })
    },
    // 提交上传头像
    submitChange() {
      if (this.avatarUrl === '') {
        this.$message({message: '请选择一张图片！', type: 'error', showClose: true});
        return false
      }
      this.$refs.upload_ref.submit()
    },
    // 打开登录弹窗
    openLogin() {
      this.$store.state.loginFlag = true;
    },
  },
  computed: {
    user() {
      let login = this.$store.state.account.length != 0;
      let avatar = this.$store.state.avatar;
      let name = this.$store.state.name;
      let id = this.$store.state.id;
      return {
        login, avatar, name, id
      }
    },
    articles: {
      set(value) {
        this.$store.state.articles = value;
      },
      get() {
        return this.$store.state.articles;
      }
    },
    categories: {
      set(value) {
        this.$store.state.categories = value;
      },
      get() {
        return this.$store.state.categories;
      }
    },
    tags: {
      set(value) {
        this.$store.state.tags = value;
      },
      get() {
        return this.$store.state.tags;
      }
    },
    // card_info() {
    //   let articles = this.$store.state.articles.length;
    //   let categories = this.$store.state.categories.length;
    //   let tags = this.$store.state.tags.length;
    //   return {
    //     articles, categories, tags
    //   }
    // }
  },
}
</script>

<style>
.card-info-social {
  line-height: 40px;
  text-align: center;
  font-size: 1.5rem;
  margin: 6px 0 -6px;
}

.card-info-social a {
  padding: 10px;
  color: #4c4948;
}

.blog-card {
  border-radius: 12px 8px 8px 12px;
  margin-top: 20px;
  line-height: 2;
  padding: 1.25rem 1.5rem;
}

.author-wrapper {
  text-align: center;
}

.blog-info-wrapper {
  display: flex;
  justify-self: center;
  padding: 0.875rem 0;
}

.blog-info-data {
  flex: 1;
  text-align: center;
}

.blog-info-data a {
  text-decoration: none;
}

.collection-btn {
  text-align: center;
  z-index: 1;
  font-size: 14px;
  position: relative;
  display: block;
  background-color: #49b1f5;
  color: #fff !important;
  height: 32px;
  line-height: 32px;
  transition-duration: 1s;
  transition-property: color;
}

.collection-btn:before {
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

.collection-btn:hover:before {
  transition-timing-function: cubic-bezier(0.45, 1.64, 0.47, 0.66);
  transform: scaleX(1);
}

.author-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-img {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: inset 0 0 0 8px rgba(255, 255, 255, .6), 0 1px 2px rgba(0, 0, 0, .1);
  transition: all .4s ease-in-out;
}

.avatar-info {
  opacity: 0;
  transform: scale(0);
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .7);
  border-radius: 50%;
  text-align: center;
  transition: all .4s ease-in-out;
}

.avatar-info p {
  opacity: 0;
  height: 20px;
  font-size: 14px;
  color: #fff;
  margin: 0 10px;
  transition: all .4s ease-in-out;
}

.avatar-img:hover {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .1), 0 1px 2px rgba(0, 0, 0, .1);
  transform: rotate(360deg);
}

.avatar-img:hover .avatar-info {
  opacity: 1;
  transform: scale(1);
}

.avatar-img:hover .avatar-info p {
  opacity: 1;
}

.me-tag-header {
  font-weight: 600;
}

.me-tag-list {
  list-style-type: none;
}

.me-tag-item {
  display: inline-block;
  padding: 4px;
  font-size: 14px;
  color: #5FB878;
}

.me-tag-item a:hover {
  text-decoration: underline;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.updateAvatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>