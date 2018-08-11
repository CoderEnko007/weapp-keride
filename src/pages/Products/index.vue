<template>
<div class="product-container">
  <div class="header" data-text="产品中心">
    <img :src="backgroundImage" mode="aspectFill">
  </div>
  <div class="search-bar">
    <SearchBar @handleConfirm="handleSearch"></SearchBar>
  </div>
  <div class="tabBar">
    <ZanTab v-bind="category1" :componentId="'category1'" @change="handleZanTab1Change"/>
  </div>
  <div class="tabBar">
    <ZanTab v-bind="secondaryCategory" :componentId="'category2'" @change="handleZanTab2Change"/>
  </div>
  <div class="productList">
    <CardList :list="productsList" @cardClick="handleCardClick"></CardList>
    <p class="text-footer" v-if="!more">没有更多数据</p>
  </div>
</div>
</template>
<script>
  import global from '@/utils/global';
  import {getCategorys, getProducts} from "@/utils/api";
  import ZanTab from '../../components/zan/tab';
  import CardList from '@/components/CardList';
  import SearchBar from '@/components/SearchBar';

  export default {
    components: {
      ZanTab,
      CardList,
      SearchBar
    },
    computed: {
      secondaryCategory() {
        let data = this.category2
        for (let i=0; i<data.length; i++) {
          if (data[i].parentId === this.category1.selectedId) {
            return data[i].body
          }
        }
      }
    },
    data() {
      return {
        backgroundImage: global.products,
        category1: {
          list: [],
          selectedId: 0,
          scroll: true,
          height: 25
        },
        category2: [],
        category3: {
          list: [],
          selectedId: 0,
          scroll: true,
          height: 25
        },
        selectedCategory: {
          type: null,
          queryId: null
        },
        page: 1,
        pageSize: 4,
        more: true,
        productsList: []
      }
    },
    methods: {
      ...ZanTab.methods,
      handleZanTab1Change (e) {
        const {selectedId} = e;
        this.category1.selectedId = selectedId;
        const data = this.category2
        for (let i=0; i<data.length; i++) {
          data[i].body.selectedId = 0
        }
        this.selectedCategory.type = 'level_1'
        this.selectedCategory.queryId = selectedId
        this.getProductsList(true, null, selectedId);
      },
      handleZanTab2Change (e) {
        const {selectedId} = e;
        const data = this.category2
        for (let i=0; i<data.length; i++) {
          if (data[i].parentId === this.category1.selectedId) {
            data[i].body.selectedId = selectedId
          }
        }
        this.selectedCategory.type = 'level_2'
        this.selectedCategory.queryId = selectedId
        if (selectedId === 0) {
          this.getProductsList(true, null, this.category1.selectedId);
        } else {
          this.getProductsList(true, selectedId);
        }
      },
      handleCardClick(id) {
        wx.navigateTo({
          url: `/pages/ProductDetail/main?id=${id}`
        })
      },
      initCategoryTabbar() {
        getCategorys().then(res => {
          this.resetPage()
          let list = res.data.list
          // 初始化一级分类导航内容
          for (let i in list) {
            if (!list.hasOwnProperty(i)) { return }
            if (list[i].category_type.id === 1) {
              let tab = {};
              tab.id = list[i].id;
              tab.title = list[i].name;
              this.category1.list.push(tab)
            }
          }
          this.category1.list.unshift({
            id: 0,
            title: '全部'
          })

          //初始化二级分类导航内容
          let parentList = this.category1.list
          for (let i=0; i<parentList.length; i++) {
            let obj = {
              parentId: parentList[i].id,
              body: {
                list: [],
                selectedId: 0,
                scroll: true,
                height: 25
              }
            }
            for (let j=0; j<list.length; j++) {
              // 一级分类中的“全部”对应的二级分类会显示所有二级类目
              if (i===0 && list[j].category_type.id === 2) {
                let tab = {};
                tab.id = list[j].id;
                tab.title = list[j].name;
                obj.body.list.push(tab)
              } else {
                if (list[j].category_type.id === 2 && list[j].parent_category.id === parentList[i].id) {
                  let tab = {};
                  tab.id = list[j].id;
                  tab.title = list[j].name;
                  obj.body.list.push(tab)
                }
              }
            }
            obj.body.list.unshift({
              id: 0,
              title: '全部'
            })
            this.category2.push(obj)
          }
        })
      },
      getProductsList(init, categoryId=0, parentCategoryId=null, name=null) {
        if (init) {
          this.page = 1;
          this.more = true;
        }
        let param = {};
        if (parentCategoryId && parentCategoryId > 0) {
          param = {
            page: this.page,
            parent_category_id: parentCategoryId
          }
        } else if (categoryId && categoryId > 0) {
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
        getProducts(param).then(res => {
          let list = res.data.list;
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
        this.getProductsList(true, 0, null, value)
      },
      resetPage() {
        this.category1 = {
          list: [],
            selectedId: 0,
            scroll: true,
            height: 25
        }
        this.category2 = []
        this.selectedCategory = {
          type: null,
          queryId: null
        }
      }
    },
    mounted() {
      this.initCategoryTabbar();
      this.getProductsList(true);
    },
    onUnload() {
      console.log('onUnload')
    },
    onPullDownRefresh() {
      this.initCategoryTabbar();
      this.getProductsList(true)
    },
    onReachBottom() {
      if (!this.more) {
        return false
      }
      this.page += 1;
      if (this.selectedCategory.type === 'level_1') {
        if (this.selectedCategory.queryId !== 0) {
          this.getProductsList(false, null, this.selectedCategory.queryId)
        } else {
          this.getProductsList(false)
        }
      } else {
        if (this.selectedCategory.queryId !== 0) {
          this.getProductsList(false, this.selectedCategory.queryId)
        } else {
          this.getProductsList(false, null, this.category1.selectedId)
        }
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
  height: 70rpx;
}
.productList {
  margin: 10px 15px;
}
</style>
