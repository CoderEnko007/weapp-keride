<template>
<div id="news" v-show="show">
  <div class="header">
    <img :src="backgroundImage" mode="aspectFill">
    <div class="hTitle">新闻动态</div>
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
        backgroundImage: global.background,
        page: 1,
        pageSize: 6,
        newsList: [],
        more: true,
        show: false,
      }
    },
    methods: {
      getNewsList(init) {
        if (init) {
          this.page = 1;
          this.more = true;
        }
        getNews({page: this.page}).then(res => {
          console.log(res);
          this.show = true;
          let list = res.results.map(v => {
            let item = {};
            item.id = v.id;
            item.title = v.title;
            item.desc = v.desc.replace(/<[^>]*>|/g,"");
            let date = new Date(v.create_time);
            item.create_time = index.formatTime(date);
            item.image = global.defaultImage;
            if (v.image !== undefined) {
              item.image = v.image
            }
            return item
          });
          if (list.length<this.pageSize) {
            this.more = false;
          }
          if (init) {
            this.newsList = list;
            wx.stopPullDownRefresh();
          } else {
            this.newsList = this.newsList.concat(list)
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

</style>
