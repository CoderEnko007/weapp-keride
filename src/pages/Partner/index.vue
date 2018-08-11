<template>
<div class="container">
  <div class="header" data-text="合作伙伴">
    <img :src="backgroundImage" mode="aspectFill">
  </div>
  <div class="tabBar">
    <ZanTab v-bind="partnerType" :componentId="'partnerType'" :isCenter="true" @change="handleZanTabChange"/>
  </div>
  <div class="list">
    <div class="pic" v-for="(item, index) in list" :key="index" @click="previewImage(item)">
      <img :src="item.image" mode="aspectFit">
    </div>
    <div class="pic" style="height: 0; visibility: hidden;"></div>
    <div class="pic" style="height: 0; visibility: hidden;"></div>
  </div>
  <floatBtnGroup></floatBtnGroup>
</div>
</template>
<script>
  import global from '../../utils/global';
  import {getPartner} from "../../utils/api";
  import floatBtnGroup from '@/components/floatBtnGroup';
  import ZanTab from '../../components/zan/tab';

  export default {
    components: {
      floatBtnGroup,
      ZanTab
    },
    data() {
      return {
        backgroundImage: global.cooperation,
        list: [],
        page: 1,
        pageSize: 2000,
        columns: 3,
        more: true,
        partnerType: {
          list: [
            {id: 1, title: '代理品牌'},
            {id: 2, title: '工业客户'}
          ],
          selectedId: 1,
          scroll: false,
          height: 25
        },
      }
    },
    methods: {
      ...ZanTab.methods,
      handleZanTabChange (e) {
        const {selectedId} = e
        this.partnerType.selectedId = selectedId
        this.getPartnerList(true)
      },
      getPartnerList(init) {
        if (init) {
          this.page = 1
          this.more = true
        }
        let params = {
          page: this.page,
          pageSize: this.pageSize,
          type: this.partnerType.selectedId
        }
        getPartner(params).then(res => {
          let list = res.data;
          if (init) {
            this.list = list;
            wx.stopPullDownRefresh();
          } else {
            this.list = this.list.concat(list)
          }
          if (this.list.length < this.pageSize) {
            this.more = false;
          }
          // let temp = this.list.length%this.columns ? this.columns-this.list.length%this.columns:0
          // console.log(temp)
          // for (let i=0; i<temp; i++) {
          //   this.list.push({
          //     id: 0,
          //     image: ''
          //   })
          // }
          // console.log(this.list)
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading()
        })
      },
      previewImage(item) {
        wx.previewImage({
          urls: [item.image] // 需要预览的图片http链接列表
        })
      }
    },
    mounted() {
      this.getPartnerList(true);
    },
    onPullDownRefresh() {
      this.getPartnerList(true)
    },
    onReachBottom() {
      if (!this.more) {
        return false
      }
      this.page += 1;
      this.getPartnerList(false);
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
/*.list {*/
  /*margin: 30rpx;*/
  /*!*column-width: 200rpx;*!*/
  /*column-count: 3;*/
  /*column-gap:20px;*/
  /*padding-bottom: 5px;*/
  /*.pic {*/
    /*margin-bottom: 15px;*/
    /*margin-top: 5px;*/
    /*padding: 5px;*/
    /*!*box-shadow: 0 0 15px #CCC;*!*/
    /*border: solid 1px #eee;*/
    /*border-radius: 4px;*/
    /*break-inside: avoid;*/
    /*img {*/
      /*width: 100%;*/
    /*}*/
  /*}*/
/*}*/
.list {
  margin: 30rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .pic {
    border: solid 1px #eee;
    border-radius: 4px;
    margin-bottom: 20px;
    width: 100px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
