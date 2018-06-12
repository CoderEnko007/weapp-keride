<template>
<div id="intro">
  <div class="header" v-show="showIntro">
    <img :src="backgroundImage" mode="aspectFill">
    <div class="hTitle">关于我们</div>
  </div>
  <div class="body" v-show="showIntro">
    <div class="text">
      <wxParse :content="intro" />
    </div>
  </div>
</div>
</template>
<script>
import global from '../../utils/global'
import {getIntro} from "../../utils/api";
import wxParse from 'mpvue-wxparse';

export default {
  components: {
    wxParse
  },
  data() {
    return {
      backgroundImage: global.background,
      intro: '',
      showIntro: false
    }
  },
  methods: {
    initIntro() {
      getIntro().then(res => {
        // 移除富文本中的图片
        this.intro = res.data.text.replace(/(<img).+?(">)/ig, '');
        this.intro = res.data.text;
        if(res.data.image.length > 0) {
          this.backgroundImage = res.data.image;
        }
        // 加载完数据后再显示
        this.$nextTick(() => {
          this.showIntro = true
        });
        console.log(this.intro, this.backgroundImage)
      })
    },
  },
  mounted() {
    this.initIntro();
  }
}
</script>
<style lang="scss" scoped>
@import "../../../static/style/global";
.body {
  margin-top: 15px;
  .text {
    margin: 15px;
    font-size: 14px;
  }
}
</style>
