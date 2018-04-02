// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import elementUi from 'element-ui'
import axios from 'axios'
import vueAxios from 'vue-axios'
import VueProgressBar from 'vue-progressbar'
import App from './App'
import router from './router'
import qs from 'qs'
import Icon from 'vue-awesome'

import 'element-ui/lib/theme-default/index.css'

import menu from './components/menu.vue'
import gamepick from './components/gamepick.vue'
import loading from './components/loading.vue'

Vue.use(vueAxios, axios)
Vue.use(elementUi)
Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '2px'
})
Vue.axios.defaults.baseURL = 'http://192.168.31.39:8080/api/'
    // Vue.axios.defaults.baseURL = 'http://www2017.zudahao.com:8080/api/'
Vue.axios.defaults.withCredentials = true;
Vue.axios.interceptors.request.use(
    config => {
        config.headers.Accept = '*/*'
        config.transformRequest = [
            function(data) {
                return qs.stringify(data)
            }
        ]
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
Vue.axios.interceptors.response.use(
    res => {
        return res
    },
    error => {
        if (error.response.status === 401) {
            router.replace({
                path: 'login',
                query: { redirect: router.currentRoute.fullPath }
            })
        } else {
            return Promise.reject(error)
        }
    }
)
Vue.component('loading', loading)
Vue.component('icon', Icon)
Vue.component('Menu', menu)
Vue.component('Gamepick', gamepick)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    router.app.$Progress.start()
    next()
})

router.afterEach(() => {
    router.app.$Progress.finish()
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});