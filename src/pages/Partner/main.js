import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '合作伙伴',
    enablePullDownRefresh: true
  }
}
