<template>
<div class="news-container">
  <div class="header" data-text="信息资讯">
    <img :src="backgroundImage" mode="aspectFill">
  </div>
  <div class="newsList">
    <CardBoard :list="newsList" @cardClick="handleCardClick"></CardBoard>
    <p class="text-footer" v-show="!more">没有更多数据</p>
  </div>
  <floatBtnGroup></floatBtnGroup>
</div>
</template>
<script>
  import global from '../../utils/global';
  import {strDisCode} from "../../utils/index";
  import {getNews} from "../../utils/api";
  import index from '../../utils/index';
  import CardBoard from '../../components/CardBoard'
  import floatBtnGroup from '@/components/floatBtnGroup';

  export default {
    components: {
      CardBoard,
      floatBtnGroup
    },
    data() {
      return {
        backgroundImage: global.news,
        page: 1,
        pageSize: 6,
        newsList: [],
        more: true,
      }
    },
    methods: {
      getNewsList(init) {
        if (init) {
          this.page = 1;
          this.more = true;
        }
        getNews({page: this.page}).then(res => {
          let list = res.data.list.map(v => {
            let item = {};
            item.id = v.id;
            item.title = v.title;

            let desc = v.desc.replace(/<[^>]*>|/g,""); //去除HTML tag
            desc = desc.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            desc = desc.replace(/&nbsp;/ig,'');//去掉&nbsp;
            desc = desc.replace(/&ldquo;/ig,'');//去掉&ldquo;
            desc = desc.replace(/&rdquo;/ig,'');//去掉&rdquo;
            item.desc = desc.replace(/\s/g,''); //将空格去掉
            item.desc = strDisCode(item.desc)

            let date = new Date(v.create_time);
            item.create_time = index.formatTime(date);
            item.image = global.defaultImage;
            if (v.image !== undefined) {
              item.image = v.image
            }
            return item
          });
          if (init) {
            this.newsList = list;
            wx.stopPullDownRefresh();
          } else {
            this.newsList = this.newsList.concat(list)
          }
          if (this.newsList.length >= res.data.count) {
            this.more = false;
          }
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading()
        }).catch(error => {
          console.log(error);
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          });
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading()
        })
      },
      handleCardClick(id) {
        wx.navigateTo({
          url: `/pages/NewsDetail/main?id=${id}`
        })
      }
    },
    mounted() {
      this.getNewsList(true)
    },
    onPullDownRefresh() {
      this.getNewsList(true)
    },
    onReachBottom() {
      if (!this.more) {
        return false
      }
      this.page += 1;
      this.getNewsList(false)
    },
    onShareAppMessage(res) {
      return {
        title: '新闻动态',
        path: `/pages/News/main`
      }
    }
  }
</script>
<style lang="scss" scoped>
.news-container {
  padding-bottom: 10px;
}
</style>
