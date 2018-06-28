<template>
  <div class="container" v-if="show">
    <TitleHeader :name="product.name" :time="product.create_time"></TitleHeader>
    <div class="body">
      <wxParse :content="product.desc" noData=""/>
    </div>
    <floatBtnGroup></floatBtnGroup>
  </div>
</template>
<script>
import {formatTime} from '../../utils/index';
import {getProductDetail} from "../../utils/api";
import wxParse from 'mpvue-wxparse';
import TitleHeader from '../../components/TitleHeader';
import floatBtnGroup from '@/components/floatBtnGroup';

const defaultProduct = {
  id: null,
  name: '',
  desc: '',
  create_time: ''
}

export default {
  components: {
    wxParse,
    TitleHeader,
    floatBtnGroup
  },
  data() {
    return {
      product: Object.assign({}, defaultProduct),
      show: false
    }
  },
  methods: {
    getDetail() {
      getProductDetail(this.product.id).then(res => {
        this.product = res.data
        console.log(this.product)
        this.show = true;
        let date = new Date(res.data.create_time);
        this.product.create_time = formatTime(date);
      })
    }
  },
  mounted() {
    this.show = false;
    this.product = Object.assign({}, defaultProduct);
    this.product.id = this.$root.$mp.query.id;
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
