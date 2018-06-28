<template>
<div class="container" v-show="show">
  <div class="header">
    <img :src="backgroundImage" mode="aspectFill">
    <div class="hTitle">合作伙伴</div>
  </div>
  <div class="list">
    <div class="pic" v-for="(item, index) in list" :key="index" @click="previewImage(item)">
      <img :src="item.image" mode="widthFix">
    </div>
  </div>
  <floatBtnGroup></floatBtnGroup>
</div>
</template>
<script>
  import global from '../../utils/global';
  import {getPartner} from "../../utils/api";
  import floatBtnGroup from '@/components/floatBtnGroup';

  export default {
    components: {
      floatBtnGroup
    },
    data() {
      return {
        show: false,
        backgroundImage: global.background,
        list: []
      }
    },
    methods: {
      getPartnerList() {
        getPartner().then(res => {
          console.log(res)
          this.show = true;
          this.list = res.data;
        })
      },
      previewImage(item) {
        wx.previewImage({
          urls: [item.image] // 需要预览的图片http链接列表
        })
      }
    },
    mounted() {
      this.getPartnerList();
    },
    onShareAppMessage(res) {
      return {
        title: '合作伙伴',
        path: `/pages/Partner/main`
      }
    }
  }
</script>
<style lang="scss" scoped>
.list {
  margin: 30rpx;
  /*column-width: 200rpx;*/
  column-count: 3;
  column-gap:20px;
  .pic {
    margin-bottom: 15px;
    margin-top: 5px;
    padding: 5px;
    box-shadow: 0 0 15px #CCC;
    border: solid 1px #eee;
    border-radius: 4px;
    break-inside: avoid;
    img {
      width: 100%;
    }
  }
}
</style>
