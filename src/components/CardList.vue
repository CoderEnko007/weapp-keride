<template>
  <div class="card-list">
    <div class="card" v-for="(item, index) in list" :key="index" @click="handleClick(item)">
      <img :src="item.image" mode="aspectFit">
      <p>{{item.name}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardList',
  props: ['list'],
  data() {
    return {
      // 传入数组list结构如下
      newList: [{
        id: 0,
        name: '',
        image: ''
      }]
    }
  },
  methods: {
    handleClick(item) {
      this.$emit('cardClick', item.id)
    }
  },
  watch: {
    list(newVal, oldVal) {
      // console.log('watch',newVal)
    }
  },
}
</script>
<style lang="scss" scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .card {
    padding: 5rpx;
    text-align: center;
    font-size: 14px;
    margin: 5rpx 0rpx 15rpx;
    img {
      width: 326rpx;
      height: 326rpx;
      border-radius: 15px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.275);
      top: 0;
      left: 0;
      transition: all 0.1s;
    }
    img:active {
      position: relative;
      box-shadow: none;
      top: 3px;
      left: 3px;
    }
    p {
      width: 250rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 5px auto 0;
    }
  }
}
</style>
