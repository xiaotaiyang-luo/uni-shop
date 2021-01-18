import Vue from 'vue'
import App from './App'
// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'

// 导入store对象
import store from './store/store.js'

// 将$http赋值给uni.$http
uni.$http = $http
// 请求的根路径
$http.baseUrl ="https://www.uinav.com"

// 请求拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
    title:"数据加载中..."
  })
}

// 响应拦截器
$http.afterRequest = function () {
 uni.hideLoading()
 }

// 封装弹出信息框
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
  store
})
app.$mount()
