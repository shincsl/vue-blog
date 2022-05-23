import Vuex from 'vuex'
import Vue from 'vue'
import {getToken, setToken, removeToken} from '../request/token'
import {login, getUserInfo, logout, register} from '../api/login'
import {updateAvatar} from "../api/updateUserInfo";
import {getArticleByUserId} from "../api/article";
import {getAllCategories} from "../api/category";
import {getAllTags} from "../api/tag";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        id: '',
        account: '',
        name: '',
        avatar: '',
        token: getToken(),
        loginFlag: false,
        registerFlag: false,
        forgetFlag: false,
        articles: [],
        categories: [],
        tags: []
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_ACCOUNT: (state, account) => {
            state.account = account
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ID: (state, id) => {
            state.id = id
        },
        SET_ARTICLES: (state, articles) => {
            state.articles = articles
        },
        SET_CATEGORIES: (state, categories) => {
            state.categories = categories
        },
        SET_TAGS: (state, tags) => {
            state.tags = tags
        },
        closeModel(state) {
            state.registerFlag = false;
            state.loginFlag = false;
        },
    },
    actions: {
        login({commit}, user) {
            return new Promise((resolve, reject) => {
                login(user.account, user.password).then(res => {
                    if (res.data.success) {
                        commit('SET_TOKEN', res.data.data)
                        setToken(res.data.data)
                        resolve()
                    } else {
                        reject(res.data.msg)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        register({commit}, user) {
            return new Promise((resolve, reject) => {
                register(user.account, user.nickname, user.password).then((res) => {
                    if (res.data.success) {
                        commit('SET_TOKEN', res.data.data)
                        setToken(res.data.data)
                        resolve()
                    } else {
                        reject(res.data.msg)
                    }
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        getUserInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(res => {
                    if (res.data.success) {
                        commit('SET_ACCOUNT', res.data.data.account)
                        commit('SET_NAME', res.data.data.nickname)
                        commit('SET_AVATAR', res.data.data.avatar)
                        commit('SET_ID', res.data.data.id)
                        resolve(res.data)
                    } else {
                        commit('SET_ACCOUNT', '')
                        commit('SET_NAME', '')
                        commit('SET_AVATAR', '')
                        commit('SET_ID', '')
                        removeToken()
                        resolve(res.data.msg)
                    }

                }).catch(error => {
                    commit('SET_ACCOUNT', '')
                    commit('SET_NAME', '')
                    commit('SET_AVATAR', '')
                    commit('SET_ID', '')
                    removeToken()
                    reject(error)
                })
            })
        },
        // 更新头像
        updateAvatar({commit, state}, formdata) {
            return new Promise((resolve, reject) => {
                updateAvatar(formdata, state.token).then(res => {
                    if (res.data.success) {
                        commit('SET_AVATAR', res.data.data.avatar)
                        resolve(res.data)
                    } else {
                        resolve(res.data.msg)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 退出
        logout({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(res => {
                    if (res.data.success) {
                        commit('SET_TOKEN', '')
                        commit('SET_ACCOUNT', '')
                        commit('SET_NAME', '')
                        commit('SET_AVATAR', '')
                        commit('SET_ID', '')
                        removeToken()
                        resolve(res.data.msg)
                    }
                }).catch(error => {
                    commit('SET_TOKEN', '')
                    commit('SET_ACCOUNT', '')
                    commit('SET_NAME', '')
                    commit('SET_AVATAR', '')
                    commit('SET_ID', '')
                    removeToken()
                    reject(error)
                })
            })
        },
        // 前端 登出
        fedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_ACCOUNT', '')
                commit('SET_NAME', '')
                commit('SET_AVATAR', '')
                commit('SET_ID', '')
                removeToken()
                resolve()
            }).catch(error => {
                console.log(error)
            })
        },
        /**
         * 获取文章和分类和标签
         * @param commit
         * @param state
         * @returns {Promise<unknown>}
         */
        getArticles({commit, state}) {
            return new Promise((resolve, reject) => {
                if (state.id) {
                    getArticleByUserId(state.id).then(res => {
                        if (res.data.success) {
                            commit('SET_ARTICLES', res.data.data)
                            resolve(res.data)
                        } else {
                            resolve(res.data.msg)
                        }
                    }).catch(error => {
                        reject(error)
                    });
                }
            })
        },
        getAllCategories({commit}) {
            return new Promise((resolve, reject) => {
                getAllCategories().then(res => {
                    if (res.data.success) {
                        commit('SET_CATEGORIES', res.data.data)
                        resolve(res.data)
                    } else {
                        resolve(res.data.msg)
                    }
                }).catch(error => {
                    reject(error)
                });
            })
        },
        getAllTags({commit}) {
            return new Promise((resolve, reject) => {
                getAllTags().then(res => {
                    if (res.data.success) {
                        commit('SET_TAGS', res.data.data)
                        resolve(res.data)
                    } else {
                        resolve(res.data.msg)
                    }
                }).catch(error => {
                    reject(error)
                });
            })
        },
    }
})
