<template>
  <el-footer class="me-area" height="80px">
    <div class="me-footer">
      <p>
        <strong>
          <router-link to="/" class="me-login-design-color">浅茶居屋</router-link>
        </strong>
      </p>
    </div>
  </el-footer>

</template>

<script>

export default {
  name: 'BaseFooter',
  data() {
    return {}
  },
  methods: {},
  mounted() {
  }
}
</script>

<style>

.el-footer {
  min-width: 100%;
  box-shadow: 0 -2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1024;
  background: linear-gradient(-45deg, #ee7752, #ce3e75, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: Gradient 10s ease infinite;
}

.me-footer {
  text-align: center;
  line-height: 60px;
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
}

.me-login-design-color {
  color: #5FB878 !important;
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
</style>
