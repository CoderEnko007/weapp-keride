<template>
  <div class="container" v-show="show">
    <TitleHeader :name="news_title" :time="create_time"></TitleHeader>
    <div class="body">
      <wxParse :content="description"/>
    </div>
    <floatBtnGroup></floatBtnGroup>
  </div>
</template>
<script>
  import index from '../../utils/index';
  import {getNewsDetail} from "../../utils/api";
  import wxParse from 'mpvue-wxparse';
  import TitleHeader from '../../components/TitleHeader';
  import floatBtnGroup from '@/components/floatBtnGroup';
  export default {
    components: {
      wxParse,
      TitleHeader,
      floatBtnGroup
    },
    data() {
      return {
        show: false,
        news_id: 0,
        news_title: '',
        create_time: '',
        description: ''
      }
    },
    methods: {
      getDetail() {
        getNewsDetail(this.news_id).then(res => {
          this.news_title = res.data.title;
          console.log(res.data.description)
          this.description = res.data.description;
          this.show = true;
          let date = new Date(res.data.create_time);
          this.create_time = index.formatTime(date);
          console.log(res.data)
        })
      }
    },
    mounted() {
      this.news_id = this.$root.$mp.query.id;
      this.getDetail()
    },
    onShareAppMessage(res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '新闻动态',
        path: `/pages/NewsDetail/main?id=${this.news_id}`
      }
    }
  }
</script>
<style lang="scss" scoped>
.container {
  margin: 15px;
  .body {
    font-size: 14px;
    margin: 15px 0;
  }
}
</style>
