<template>
<div id="productList">
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
      CardList
    },
    data() {
      return {
        backgroundImage: global.background,
        category: {
          list: [],
          selectedId: 0,
          scroll: true,
          height: 25
        },
        page: 0,
        pageSize: 6,
        more: true,
        productsList: []
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
        console.log(id)
      },
      initCategoryTabbar() {
        getCategorys().then(res => {
          this.category.list = res.data.list.map(v => {
            let tab = {};
            tab.id = v.id;
            tab.title = v.name;
            return tab
          });
          this.category.list.unshift({
            id: 0,
            title: '全部'
          })
        })
      },
      getProductsList(init, categoryId=0) {
        if (init) {
          this.page = 0;
          this.more = true;
        }
        let param = {};
        if (categoryId) {
          param = {
            page: this.page,
            category_id: categoryId
          }
        } else {
          param = { page: this.page }
        }
        wx.showNavigationBarLoading();
        getProducts(param)
          .then(res => {
            let list = res.data.map(v => {
              let item = {};
              item.id = v.id;
              item.name = v.name;
              item.image = global.defaultImage;
              if (v.image !== undefined) {
                v.image = JSON.parse(v.image);
                if (v.image.length > 0) {
                  item.image = v.image[0]
                }
              }
              return item
            });
            if (list.length<this.pageSize && this.page > 0) {
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
      this.getProductsList(true)
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
