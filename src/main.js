import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from "vue-axios";
// 导入后台管理全局样式表
import "./assets/css/index.css";
import moment from "moment";
import "./assets/css/iconfont.css";
import "./assets/css/markdown.css";
import animated from "animate.css";
import config from "./assets/js/config";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import {formatTime} from "./utils/time";
import lodash from 'lodash'

Vue.prototype.config = config;
Vue.config.productionTip = false;
Vue.use(animated);
Vue.use(VueAxios, axios);
ElementUI.Dialog.props.lockScroll.default = false;
Vue.use(ElementUI);

Object.defineProperty(Vue.prototype, '$_', { value: lodash })

Vue.filter('format', formatTime);

Vue.filter("date", function(value) {
  return moment(value).format("YYYY-MM-DD");
});

Vue.filter("hour", function(value) {
  return moment(value).format("HH:mm:ss");
});

Vue.filter("num", function(value) {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "k";
  }
  return value;
});


router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

router.afterEach(() => {
  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
  NProgress.done();
});

axios.interceptors.response.use(
    function(response) {
      switch (response.data.code) {
        case 50000:
      }
      return response;
    },
    function(error) {
      return Promise.reject(error);
    }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
