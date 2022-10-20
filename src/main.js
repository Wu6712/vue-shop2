import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式表
import '../public/global.css'

// 导入axios
import axios from 'axios'
// 根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

// 引入Element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
