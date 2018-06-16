<template>
<div class="container" v-show="show">
  <div class="header">
    <img :src="backgroundImage" mode="aspectFill">
    <div class="hTitle">联系我们</div>
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
  padding: 30rpx;
  column-width: 200rpx;
  .pic {
    margin: 15rpx 0 30rpx;
    padding: 5px;
    box-shadow: 0 0 15px #CCC;
    img {
      max-width: 200rpx;
    }
  }
}
</style>
