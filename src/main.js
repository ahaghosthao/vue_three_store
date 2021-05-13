import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ThreePlugin from './plugins/three';

Vue.config.productionTip = false
Vue.use(ThreePlugin)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
