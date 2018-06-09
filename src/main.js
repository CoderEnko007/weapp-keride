import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/Introduction/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#206994',
      navigationBarTitleText: '客瑞德机械零部件有限公司',
      navigationBarTextStyle: 'white',
      backgroundColor: '#ccc',
    },
    tabBar: {
      selectedColor: "#206994",
      list: [{
        pagePath: "pages/index/main",
        text: "首页",
        iconPath: "static/img/home.png",
        selectedIconPath: "static/img/home-active.png"
      }, {
        pagePath: "pages/Products/main",
        text: "产品中心",
        selectedColor: "#206994",
        iconPath: "static/img/product.png",
        selectedIconPath: "static/img/product-active.png"
      }, {
        pagePath: "pages/Contact/main",
        text: "联系我们",
        selectedColor: "#206994",
        iconPath: "static/img/contact.png",
        selectedIconPath: "static/img/contact-active.png"
      }]
    }
  }
}
