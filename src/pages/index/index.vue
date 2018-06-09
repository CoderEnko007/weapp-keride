<template>
<div class="container">
  <Swiper :banners="banners" @swiperClick="swiperClick"></Swiper>
  <div class="navTab">
    <div class="navItem" v-for="(item, index) in navTab" :key="index" @click="navTabClick(item)">
      <img :src="item.icon" mode="aspectFit">
      <p>{{item.text}}</p>
    </div>
  </div>
  <div class="intro">
    <img :src="backgroundImage" mode="aspectFill">
    <div class="about">
      <div class="title">关于我们</div>
      <p class="text zan-ellipsis--l3">{{intro}}</p>
      <button class="more" @click="handleMoreClick">了解更多</button>
    </div>
  </div>
  <div class="products">
    <div class="title">产品列表</div>
  </div>
</div>
</template>

<script>
import {getBanners, getIntro} from "../../utils/api";
import Swiper from '@/components/Swiper'

export default {
  components: {
    Swiper,
  },
  data () {
    return {
      banners: [],
      intro: [],
      navTab: [
        {icon: '/static/img/company.png', text: '公司简介', url: '/pages/Introduction/main', isTab: false},
        {icon: '/static/img/product1.png', text: '产品中心', url: '/pages/Products/main', isTab: true},
        {icon: '/static/img/partner.png', text: '合作伙伴', url: '/pages/Partner/main', isTab: false},
        {icon: '/static/img/news.png', text: '新闻动态', url: '/pages/News/main', isTab: false},
        {icon: '/static/img/contact1.png', text: '联系我们', url: '/pages/Contact/main', isTab: true},
      ],
      backgroundImage: "http://localhost:5757/images/background/1528534095879.jpg"
    }
  },
  methods: {
    initBanners() {
      getBanners().then(res => {
          this.banners = res.data.list
        }).catch(err => {
          console.log(err)
      })
    },
    initIntro() {
      getIntro().then(res => {
        this.intro = res.data.text.replace(/<[^>]*>|/g,"");
        if(res.data.image.length > 0) {
          this.backgroundImage = res.data.image;
        }
        console.log(this.intro, this.backgroundImage)
      })
    },
    swiperClick(itemId) {
      console.log("aaa",itemId)
    },
    navTabClick(item) {
      if (item.isTab) {
        wx.switchTab({
          url: item.url
        })
      } else {
        wx.navigateTo({
          url: item.url
        })
      }
    },
    handleMoreClick() {
      wx.navigateTo({
        url: '/pages/Introduction/main'
      })
    }
  },
  mounted () {
    this.initBanners();
    this.initIntro();
  }
}
</script>

<style lang="scss" scoped>
.navTab {
  margin: 12px 10rpx;
  .navItem {
    display: inline-block;
    width: 146rpx;
    font-size: 12px;
    text-align: center;
    img {
      width: 24px;
      height: 24px;
      margin: 0 auto;
    }
  }
}
.intro {
  position: relative;
  font-size: 14px;
  color: white;
  width: 100%;
  height: 350rpx;
  overflow:hidden;
  img {
    width: 100%;
    height: 100%;
    filter: blur(8px);
    transform: scale(1.2);
    overflow: hidden;
  }
  .about {
    position: absolute;
    top: 15px;
    left: 0;
    width: 90%;
    margin: 5px 15px;
    overflow: hidden;
    .text {
      margin-top: 15px;
      text-indent: 2em;
    }
    .more {
      color: white;
      width: 80px;
      height: 30px;
      line-height: 30px;
      margin-top: 15px;
      margin-left: 15px;
      padding: 0;
      font-size: 14px;
      border: 1px solid white;
      border-radius: 12px;
      background-color: transparent;
    }
  }
}
.products {
  position: relative;
  color: white;
  width: 100%;
}

</style>
