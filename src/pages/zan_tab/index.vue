<template>
  <div class="container">

    <div class="doc-title zan-hairline--bottom">TAB</div>

    <div style="margin: 20px 0">
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
    data () {
      return {
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
        const {componentId, selectedId} = e
        this[componentId].selectedId = selectedId
        console.log(e)
      }
    }
  }
</script>
<style  scoped >

</style>
