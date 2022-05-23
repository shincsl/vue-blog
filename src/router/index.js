import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import ArticleDetail from "../views/article/ArticleDetail";
import BlogCategoryTag from "../views/blog/BlogCategoryTag";
import BlogAllCategoryTag from "../views/blog/BlogAllCategoryTag";
import BlogWrite from "../views/blog/BlogWrite";
import ArticleArchives from "../views/article/ArticleArchives";
import store from '../store'
import {Message} from "element-ui";

Vue.use(VueRouter)

const routes = [
    {
        path: '/write',
        component: BlogWrite,
        meta: {
            requireLogin: true
        },
    },
    {
        path: "/",
        component: Home,
        meta: {
            title: "shincsl的博客"
        }
    },
    {
        path: "/articles/:id",
        component: ArticleDetail
    },
    {
        path: '/archives/:id',
        component: ArticleArchives
    },
    {
        path: '/:type/all',
        component: BlogAllCategoryTag
    },
    {
        path: '/:type/:id',
        component: BlogCategoryTag
    },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    if (store.state.token) {
        // 是否有账号信息，如果没有，获取用户信息
        if (store.state.account.length == 0) {
            // 获取用户信息
            store.dispatch("getUserInfo").then(res => {
                store.dispatch("getArticles").then();
                store.dispatch("getAllCategories").then();
                store.dispatch("getAllTags").then();
                next();
            }).catch(err => {
                Message({
                    type: "warning",
                    showClose: true,
                    message: "未登录或登录已过期"
                });
                next({path: '/'});
            })
        } else {
            next();
        }
    } else {
        if (to.matched.some(r => r.meta.requireLogin)) {
            Message({
                type: "warning",
                showClose: true,
                message: "未登录或登录已过期"
            });
        } else {
            next();
        }
    }
})

router.afterEach(() => {
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
});

export default router
