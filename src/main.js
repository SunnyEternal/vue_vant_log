import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/vant.js'
import './assets/css/global.css'
// 引入全部样式
import 'vant/lib/index.less';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
