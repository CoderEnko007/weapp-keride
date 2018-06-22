<template>
<div id="intro" v-show="show">
  <div class="header" >
    <img :src="backgroundImage" mode="aspectFill">
    <div class="hTitle">关于我们</div>
  </div>
  <div class="body">
    <div class="text">
      <wxParse :content="intro" />
    </div>
  </div>
  <floatBtnGroup></floatBtnGroup>
</div>
</template>
<script>
import global from '../../utils/global'
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
      backgroundImage: '',
      intro: '',
      show: false
    }
  },
  methods: {
    initIntro() {
      getIntro().then(res => {
        // 移除富文本中的图片
        // this.intro = res.data.text.replace(/(<img).+?(">)/ig, '');
        this.intro = res.text;
        if(res.image.length > 0) {
          this.backgroundImage = res.image;
        }
        // 加载完数据后再显示
        this.$nextTick(() => {
          this.show = true
        });
        console.log(this.intro, this.backgroundImage)
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
