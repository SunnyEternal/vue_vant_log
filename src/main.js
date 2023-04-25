import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/vant.js'
import './assets/css/global.css'
// 引入全部样式
import 'vant/lib/index.less';

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
