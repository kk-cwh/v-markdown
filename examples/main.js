import Vue from 'vue'
import App from './App.vue'
import VMarkdown from '../packages/index'
Vue.use(VMarkdown)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
