<template>
  <div class="container" v-show="show">
    <TitleHeader :name="product_name" :time="create_time"></TitleHeader>
    <div class="body">
      <wxParse :content="description" noData=""/>
    </div>
    <floatBtnGroup></floatBtnGroup>
  </div>
</template>
<script>
import index from '../../utils/index';
import {getProductDetail} from "../../utils/api";
import wxParse from 'mpvue-wxparse';
import TitleHeader from '../../components/TitleHeader';
import floatBtnGroup from '@/components/floatBtnGroup';

export default {
  components: {
    wxParse,
    TitleHeader,
    floatBtnGroup
  },
  data() {
    return {
      product_id: 0,
      product_name: '',
      description: '',
      create_time: '',
      show: false
    }
  },
  methods: {
    getDetail() {
      getProductDetail(this.product_id).then(res => {
        this.product_name = res.data.name;
        this.description = res.data.description[0];
        this.show = true;
        let date = new Date(res.data.create_time);
        this.create_time = index.formatTime(date);
      })
    }
  },
  mounted() {
    this.product_id = this.$root.$mp.query.id;
    this.getDetail();
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '产品信息',
      path: `/pages/ProductDetail/main?id=${this.product_id}`
    }
  },
}
</script>
<style lang="scss" scoped>
.container {
  margin: 15px;
  .body {
    font-size: 14px;
    margin: 15px 0;
  }
}
</style>
