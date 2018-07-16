<template>
<div class="search-bar">
  <div class="search-bar-form">
    <div class="serach-bar-box">
      <div class="zan-icon zan-icon-search"></div>
      <input type="text" placeholder="搜索" @confirm="handleConfirm">
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'SearchBar',
  methods: {
    handleConfirm(e) {
      this.$emit('handleConfirm', e.mp.detail.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.search-bar {
  position: relative;
  display: flex;
  background-color: #efeff4;
  padding: 8rpx 14rpx;
  border-top: 1rpx solid #d7d6dc;
  border-bottom: 1rpx solid #d7d6dc;
  .search-bar-form {
    position: relative;
    background-color: #fff;
    flex: auto;
    border: 1rpx solid #e6e6ea;
    .serach-bar-box {
      padding-left: 60rpx;
      font-size: 14px;
      color: #ccc;
      .zan-icon {
        position: absolute;
        left: 20rpx;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
