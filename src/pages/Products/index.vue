<template>
<div id="productList" v-show="showList">
  <div class="header">
    <img :src="backgroundImage" mode="aspectFill">
    <div class="hTitle">产品中心</div>
  </div>
  <div class="tabBar">
    <ZanTab v-bind="category" :componentId="'category'" @change="handleZanTabChange"/>
  </div>
  <div class="productList">
    <CardList :list="productsList" @cardClick="handleCardClick"></CardList>
    <p class="text-footer" v-if="!more">没有更多数据</p>
  </div>
</div>
</template>
<script>
  import global from '../../utils/global';
  import {getCategorys, getProducts} from "../../utils/api";
  import ZanTab from '../../components/zan/tab';
  import CardList from '../../components/CardList';

  export default {
    components: {
      ZanTab,
      CardList,
    },
    data() {
      return {
        loadStep: 0,
        backgroundImage: global.background,
        category: {
          list: [],
          selectedId: 0,
          scroll: true,
          height: 25
        },
        page: 1,
        pageSize: 4,
        more: true,
        productsList: []
      }
    },
    computed: {
      showList() {
        return this.loadStep >= 2;
      }
    },
    methods: {
      ...ZanTab.methods,
      handleZanTabChange (e) {
        const {selectedId} = e;
        this.category.selectedId = selectedId;
        this.getProductsList(true, selectedId);
      },
      handleCardClick(id) {
        wx.navigateTo({
          url: `/pages/ProductDetail/main?id=${id}`
        })
      },
      initCategoryTabbar() {
        getCategorys().then(res => {
          this.category.list = res.map(v => {
            let tab = {};
            tab.id = v.id;
            tab.title = v.name;
            return tab
          });
          this.loadStep += 1;
          this.category.list.unshift({
            id: 0,
            title: '全部'
          })
        })
      },
      getProductsList(init, categoryId=0) {
        if (init) {
          this.page = 1;
          this.more = true;
        }
        let param = {};
        if (categoryId && categoryId > 0) {
          param = {
            page: this.page,
            category: categoryId
          }
        } else {
          param = { page: this.page }
        }
        wx.showNavigationBarLoading();
        getProducts(param)
          .then(res => {
            console.log(res)
            let list = res.results;
            this.loadStep += 1;
            if (list.length<this.pageSize) {
              this.more = false;
            }
            if (init) {
              this.productsList = list;
              wx.stopPullDownRefresh();
            } else {
              this.productsList = this.productsList.concat(list)
            }
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading()
          }).catch(error => {
            console.log(error);
            this.loadStep += 1;
            wx.showToast({
              title: '加载失败',
              icon: 'none',
              duration: 2000
            });
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading()
          })
      }
    },
    mounted() {
      this.initCategoryTabbar();
      this.getProductsList(true);
      console.log(this.backgroundImage)
    },
    onPullDownRefresh() {
      this.initCategoryTabbar();
      if (this.category.selectedId !== 0) {
        this.getProductsList(true, this.category.selectedId)
      } else {
        this.getProductsList(true)
      }
    },
    onReachBottom() {
      if (!this.more) {
        return false
      }
      this.page += 1;
      if (this.category.selectedId !== 0) {
        this.getProductsList(false, this.category.selectedId)
      } else {
        this.getProductsList(false)
      }
    },
    onShareAppMessage(res) {
      return {
        title: '产品中心',
        path: `/pages/Products/main`
      }
    }
  }
</script>
<style lang="scss" scoped>
.tabBar {
  height: 80rpx;
}
.productList {
  margin: 10px 15px;
}
</style>
