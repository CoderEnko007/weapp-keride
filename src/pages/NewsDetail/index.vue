<template>
  <div class="container" v-show="show">
    <TitleHeader :name="newsDetail.title" :time="newsDetail.create_time"></TitleHeader>
    <div class="body">
      <wxParse :content="newsDetail.desc" noData=""/>
    </div>
    <floatBtnGroup></floatBtnGroup>
  </div>
</template>
<script>
  import {formatTime} from '../../utils/index';
  import {getNewsDetail} from "../../utils/api";
  import wxParse from 'mpvue-wxparse';
  import TitleHeader from '../../components/TitleHeader';
  import floatBtnGroup from '@/components/floatBtnGroup';

  const defaultNews = {
    id: undefined,
    title: '',
    desc: '',
    image: '',
    create_time: ''
  };

  export default {
    components: {
      wxParse,
      TitleHeader,
      floatBtnGroup
    },
    data() {
      return {
        newsDetail: Object.assign({}, defaultNews),
        show: false
      }
    },
    methods: {
      getDetail() {
        getNewsDetail(this.newsDetail.id).then(res => {
          this.newsDetail = res.data;
          this.show = true;
          let date = new Date(res.data.create_time);
          this.newsDetail.create_time = formatTime(date);
        })
      }
    },
    mounted() {
      this.newsDetail.id = this.$root.$mp.query.id;
      this.getDetail()
    },
    onUnload() {
      this.show = false;
      this.newsDetail = Object.assign({}, defaultNews);
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
  padding-bottom: 5px;
  .body {
    font-size: 14px;
    margin: 15px 0;
  }
}
</style>
