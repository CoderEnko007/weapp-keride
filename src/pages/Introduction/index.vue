<template>
<div id="intro" v-if="intro">
  <div class="header" >
    <img :src="intro.image" mode="aspectFill">
    <div class="hTitle">关于我们</div>
  </div>
  <div class="body">
    <div class="text">
      <wxParse :content="intro.text" />
    </div>
  </div>
  <floatBtnGroup></floatBtnGroup>
</div>
</template>
<script>
import {getIntro} from "../../utils/api";
import wxParse from 'mpvue-wxparse';
import floatBtnGroup from '@/components/floatBtnGroup';

export default {
  components: {
    wxParse,
    floatBtnGroup
  },
  data() {
    return {
      intro: null,
    }
  },
  methods: {
    initIntro() {
      getIntro().then(res => {
        // 移除富文本中的图片
        // this.intro = res.data.text.replace(/(<img).+?(">)/ig, '');
        this.intro = res.data;
      })
    },
  },
  mounted() {
    this.initIntro();
  },
  onShareAppMessage(res) {
    return {
      title: '客瑞德机械零部件有限公司',
      path: `/pages/Introduction/main`
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../utils/style/global";
.body {
  margin-top: 15px;
  .text {
    margin: 15px;
    font-size: 14px;
  }
}
</style>
