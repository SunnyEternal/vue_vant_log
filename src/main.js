import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/vant.js'
import './assets/css/global.css'
import 'vant/lib/index.less'    // 引入全部样式

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'    // 配置请求的根路径
// 为请求头添加“Authorization”属性，用于调用API时  
axios.interceptors.request.use(config => {
  console.log('main.js config:', config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config   // 在最后必须 return config
})
axios.interceptors.response.use(config => {
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

export const eventBus = new Vue()

// Vue.dateFormat(function() {
//   const dt = new Date()
//   const y = dt.getFullYear();
// 	let m = dt.getMonth() + 1;
// 	m = m < 10 ? ('0' + m) : m;
// 	let d = dt.getDate();
// 	d = d < 10 ? ('0' + d) : d;
//   return `${y}/${m}/${d}`
// })

Vue.prototype.$formatDate = function() {
  const dt = new Date()
  const y = dt.getFullYear();
	let m = dt.getMonth() + 1;
	// m = m < 10 ? ('0' + m) : m;
	let d = dt.getDate();
	// d = d < 10 ? ('0' + d) : d;
  return `${y}/${m}/${d}`
}

// Vue.prototype.$getDateBeforeSixDays = function() {
//   const today = new Date();
//   const sixDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
//   const year = sixDaysAgo.getFullYear();
//   const month = String(sixDaysAgo.getMonth() + 1).padStart(2, '0');
//   const day = String(sixDaysAgo.getDate()).padStart(2, '0');
//   return `${year}, ${month}, ${day}`;
// };
Vue.prototype.$sixDays = function() {
  const today = new Date();
  const sixDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  return sixDaysAgo;
};

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
