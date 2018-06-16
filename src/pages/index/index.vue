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
      <button class="more" @click="moreIntro">了解更多</button>
    </div>
  </div>
  <div class="card-block">
    <div class="title">产品列表</div>
    <CardList :list="productsList" @cardClick="handleCardClick"></CardList>
    <button @click="moreProducts">查看更多</button>
  </div>
  <div class="card-block">
    <div class="title">新闻动态</div>
    <CardBoard :list="news" @cardClick="handleNewsClick"></CardBoard>
    <button @click="moreNews">查看更多</button>
  </div>
</div>
</template>

<script>
import index from '../../utils/index';
import global from '../../utils/global';
import {getBanners, getIntro, getProducts, getNews} from "../../utils/api";
import Swiper from '@/components/Swiper';
import CardList from '@/components/CardList';
import CardBoard from '@/components/CardBoard';

export default {
  components: {
    Swiper,
    CardList,
    CardBoard
  },
  data () {
    return {
      banners: [],
      intro: [],
      productsList: [],
      news: [],
      navTab: [
        {icon: '/static/img/company.png', text: '公司简介', url: '/pages/Introduction/main', isTab: false},
        {icon: '/static/img/product1.png', text: '产品中心', url: '/pages/Products/main', isTab: true},
        {icon: '/static/img/partner.png', text: '合作伙伴', url: '/pages/Partner/main', isTab: false},
        {icon: '/static/img/news.png', text: '新闻动态', url: '/pages/News/main', isTab: false},
        {icon: '/static/img/contact1.png', text: '联系我们', url: '/pages/Contact/main', isTab: true},
      ],
      backgroundImage: global.background,
      refreshFlag: 0
    }
  },
  methods: {
    initBanners() {
      getBanners().then(res => {
          this.banners = res.data.list;
          this.handleStopPullDown();
        }).catch(err => {
          this.handleStopPullDown();
          console.log(err)
      })
    },
    initIntro() {
      getIntro().then(res => {
        // 去除html标签，截取正文
        this.intro = res.data.text.replace(/<[^>]*>|/g,""); //去除HTML tag
        this.intro = this.intro.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
        this.intro = this.intro.replace(/&nbsp;/ig,'');//去掉&nbsp;
        this.intro = this.intro.replace(/\s/g,''); //将空格去掉
        if(res.data.image.length > 0) {
          this.backgroundImage = res.data.image;
        }
        this.handleStopPullDown();
        console.log(this.intro, this.backgroundImage)
      })
    },
    initProducts() {
      getProducts().then(res => {
        this.productsList = res.data.map(v => {
          let item = {};
          item.id = v.id;
          item.name = v.name;
          item.image = global.defaultImage;
          if (v.image !== undefined) {
            v.image = JSON.parse(v.image);
            if (v.image.length > 0) {
              item.image = v.image[0]
            }
          }
          return item
        }).slice(0, 4);
        this.handleStopPullDown();
      })
    },
    initNews() {
      getNews().then(res => {
        this.news = res.data.map(v => {
          let item = {};
          item.id = v.id;
          item.title = v.title;
          item.desc = v.description.replace(/<[^>]*>|/g,"");
          let date = new Date(v.create_time);
          item.create_time = index.formatTime(date);
          item.image = global.defaultImage;
          if (v.image !== undefined) {
            v.image = JSON.parse(v.image);
            if (v.image.length > 0) {
              item.image = v.image[0]
            }
          }
          return item
        }).slice(0, 3);
        this.handleStopPullDown();
        console.log(this.news)
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
    moreIntro() {
      wx.navigateTo({
        url: '/pages/Introduction/main'
      })
    },
    handleCardClick(id) {
      wx.navigateTo({
        url: `/pages/ProductDetail/main?id=${id}`
      })
    },
    moreProducts() {
      wx.switchTab({
        url: '/pages/Products/main'
      })
    },
    handleNewsClick(id) {
      wx.navigateTo({
        url: `/pages/NewsDetail/main?id=${id}`
      })
    },
    moreNews() {
      wx.navigateTo({
        url: '/pages/News/main'
      })
    },
    handleStopPullDown() {
      this.refreshFlag += 1;
      if (this.refreshFlag >= 4) {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      }
    }
  },
  mounted () {
    this.initBanners();
    this.initIntro();
    this.initProducts();
    this.initNews();
  },
  onPullDownRefresh() {
    this.initBanners();
    this.initIntro();
    this.initProducts();
    this.initNews();
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
  font-size: 12px;
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
      text-indent:2em;
    }
    .more {
      float: right;
      color: white;
      width: 100px;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      margin-right: 15px;
      padding: 0;
      font-size: 12px;
      border: 1px solid white;
      border-radius: 20px;
      background-color: transparent;
    }
  }
}
.card-block {
  position: relative;
  padding: 10px 15px 5px;
  .title {
    color: black;
    margin-bottom: 15px;
  }
  .title::after {
    border-bottom: 3px solid #CCC;
  }
  button {
    width: 100px;
    height: 30px;
    line-height: 30px;
    margin: 5px auto;
    padding: 0;
    font-size: 12px;
    border-radius: 20px;
    color: black;
    background-color: white;
    border: 1px solid black;
  }
}
.gray-background {
  background-color: #EEE;
}

</style>
