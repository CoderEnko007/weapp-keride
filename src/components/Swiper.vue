<template>
<div id="swiper">
  <swiper indicator-dots autoplay circular interval="3000">
    <swiper-item class="item" v-for="(item, index) in banners" :key="index" @click="handleClick(item)">
      <img class="swiper-img" :src="item.image" mode="aspectFill">
    </swiper-item>
  </swiper>
</div>
</template>
<script>
export default {
  props: ['banners'],
  data() {
    return {

    }
  },
  methods: {
    handleClick(item) {
      this.$emit('swiperClick', item.id)
    }
  }
}
</script>
<style lang="scss" scoped>
.item {
  height: 400rpx;
}
.swiper-img {
  width: 100%;
  height: 100%;
}
</style>
