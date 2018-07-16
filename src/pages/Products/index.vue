<template>
<div class="product-container">
  <div class="header" data-text="产品中心">
    <img :src="backgroundImage" mode="aspectFill">
  </div>
  <div class="tabBar" v-if="category.list">
    <ZanTab v-bind="category" :componentId="'category'" @change="handleZanTabChange"/>
  </div>
  <SearchBar @handleConfirm="handleSearch"></SearchBar>
  <div class="productList" v-if="productsList">
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
  import SearchBar from '@/components/SearchBar';

  export default {
    components: {
      ZanTab,
      CardList,
      SearchBar
    },
    data() {
      return {
        loadStep: 0,
        backgroundImage: global.products,
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
          this.category.list = res.data.list.map(v => {
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
      getProductsList(init, categoryId=0, name=null) {
        if (init) {
          this.page = 1;
          this.more = true;
        }
        let param = {};
        if (categoryId && categoryId > 0) {
          param = {
            page: this.page,
            category_id: categoryId
          }
        } else if(name) {
          param = {
            page: 1,
            name: name
          }
        } else {
          param = { page: this.page }
        }
        wx.showNavigationBarLoading();
        getProducts(param)
          .then(res => {
            let list = res.data.list;
            // this.loadStep += 1;
            if (init) {
              this.productsList = list;
              wx.stopPullDownRefresh();
            } else {
              this.productsList = this.productsList.concat(list)
            }
            if (this.productsList.length >= res.data.count) {
              this.more = false;
            }
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading()
          }).catch(error => {
            console.log(error);
            // this.loadStep += 1;
            wx.showToast({
              title: '加载失败',
              icon: 'none',
              duration: 2000
            });
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading()
          })
      },
      handleSearch(value) {
        this.getProductsList(true, 0, value)
      }
    },
    mounted() {
      this.initCategoryTabbar();
      this.getProductsList(true);
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
.product-container {
  padding-bottom: 10px;
}
.tabBar {
  height: 80rpx;
}
.productList {
  margin: 10px 15px 0;
}
</style>
