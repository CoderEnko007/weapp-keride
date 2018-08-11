<template>
<div class="container" v-if="showPage">
  <Swiper :banners="banners" @swiperClick="swiperClick" v-if="banners"></Swiper>
  <div class="navTab">
    <div class="navItem" v-for="(item, index) in navTab" :key="index" @click="navTabClick(item)">
      <img :src="item.icon" mode="aspectFit">
      <p>{{item.text}}</p>
    </div>
  </div>
  <div class="intro" v-if="intro">
    <img :src="intro.image" mode="aspectFill">
    <div class="about">
      <div class="title">
        <span>关于我们</span><span><b>aaa</b></span>
        <button class="textBtn" @click="moreIntro">更多 >></button>
      </div>
      <p class="text">{{intro.text}}</p>
    </div>
  </div>
  <div class="card-block" v-if="productsList">
    <div class="title">产品列表</div>
    <CardList :list="productsList" @cardClick="handleCardClick"></CardList>
    <button class="more" @click="moreProducts">查看更多</button>
  </div>
  <div class="card-block" v-if="news">
    <div class="title">信息资讯</div>
    <CardBoard :list="news" @cardClick="handleNewsClick"></CardBoard>
    <button class="more" @click="moreNews">查看更多</button>
  </div>
  <div class="copy-right">
    <span>© 客瑞德机械零部件有限公司</span>
  </div>
</div>
</template>

<script>
import index from '../../utils/index';
import {strDisCode} from "../../utils/index";
import {getBanners, getIntro, getProducts, getNews} from "../../utils/api";
import Swiper from '@/components/Swiper';
import CardList from '@/components/CardList';
import CardBoard from '@/components/CardBoard';

export default {
  components: {
    Swiper,
    CardList,
    CardBoard,
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
        {icon: '/static/img/news.png', text: '信息咨询', url: '/pages/News/main', isTab: false},
        {icon: '/static/img/contact1.png', text: '联系我们', url: '/pages/Contact/main', isTab: true},
      ],
      backgroundImage: '',
      refreshFlag: 0,

    }
  },
  computed: {
    showPage() {
      return this.refreshFlag >= 4;
    }
  },
  methods: {
    initBanners() {
      getBanners().then(res => {
          this.banners = res.data;
          this.handleStopPullDown();
        }).catch(err => {
          this.handleStopPullDown();
          console.log(err)
      })
    },
    initIntro() {
      getIntro().then(res => {
        this.intro = res.data;
        // 去除html标签，截取正文
        let text = res.data.text.replace(/<[^>]*>|/g,""); //去除HTML tag
        text = text.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
        text = text.replace(/&nbsp;/ig,'');//去掉&nbsp;
        text = text.replace(/&ldquo;/ig,'');//去掉&ldquo;
        text = text.replace(/&rdquo;/ig,'');//去掉&rdquo;
        this.intro.text = text.replace(/\s/g,''); //将空格去掉
        this.intro.text = strDisCode(this.intro.text)
        this.handleStopPullDown();
      })
    },
    initProducts() {
      getProducts({ page: 1 }).then(res => {
        this.productsList = res.data.list.slice(0, 4);
        this.handleStopPullDown();
      })
    },
    initNews() {
      getNews({ page: 1 }).then(res => {
        this.news = res.data.list.map(v => {
          let item = {};
          item.id = v.id;
          item.title = v.title;

          // item.desc = v.desc.replace(/<[^>]*>|/g,"");
          let desc = v.desc.replace(/<[^>]*>|/g,""); //去除HTML tag
          desc = desc.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
          desc = desc.replace(/&nbsp;/ig,'');//去掉&nbsp;
          desc = desc.replace(/&ldquo;/ig,'');//去掉&ldquo;
          desc = desc.replace(/&rdquo;/ig,'');//去掉&rdquo;
          item.desc = desc.replace(/\s/g,''); //将空格去掉
          item.desc = strDisCode(item.desc)

          let date = new Date(v.create_time);
          item.create_time = index.formatTime(date);
          item.image = v.image;
          return item
        }).slice(0, 3);
        this.handleStopPullDown();
      })
    },
    swiperClick(item) {
      wx.navigateTo({
        url: `/pages/ProductDetail/main?id=${item.product.id}`
      })
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
  },
  onShareAppMessage(res) {
    return {
      title: '客瑞德机械零部件有限公司',
      path: `/pages/Index/main`
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 20px;
}
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
    top: 0;
    bottom: 0;
    left: 0;
    padding: 15px 15px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.3);
    .text {
      margin-top: 15px;
      text-indent:2em;
      max-height: 100px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display:-webkit-box;
      -webkit-line-clamp:5;
      -webkit-box-orient:vertical
    }
    .more {
      float: right;
      color: white;
      width: 100px;
      margin-top: 10px;
      margin-right: 15px;
      padding: 0;
      font-size: 12px;
      border: 1px solid white;
      border-radius: 20px;
      background-color: transparent;
    }
    .textBtn {
      float: right;
      font-size: 14px;
      color: #e5e5e5;
      background-color: transparent;
      border-radius:0;
      margin: 0;
      padding: 0;
      line-height: 60rpx;
    }
    .textBtn::after {
      border: none;
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
