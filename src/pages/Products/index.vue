<template>
<div id="productList">
  <div class="header">
    <img :src="backgroundImage" mode="aspectFill">
    <div class="hTitle">产品中心</div>
  </div>
  <div class="tabBar">
    <ZanTab v-bind="tab3" :componentId="'tab3'" @change="handleZanTabChange"/>
  </div>
</div>
</template>
<script>
  import ZanTab from '../../components/zan/tab'
  export default {
    components: {
      ZanTab
    },
    data() {
      return {
        backgroundImage: 'http://localhost:5757/images/background/background-5.jpg',
        tab3: {
          list: [{
            id: '1',
            title: '商品1'
          }, {
            id: '2',
            title: '商品2'
          }, {
            id: '3',
            title: '商品3'
          }, {
            id: '4',
            title: '商品4'
          }, {
            id: '5',
            title: '商品5'
          }, {
            id: '6',
            title: '商品6'
          }],
          selectedId: '1',
          scroll: true,
          height: 25
        }
      }
    },
    methods: {
      ...ZanTab.methods,
      handleZanTabChange (e) {
        const {componentId, selectedId} = e;
        this[componentId].selectedId = selectedId;
        console.log(e)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
