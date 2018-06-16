<template>
<div class="group">
  <button open-type="share" class="share"><img src="/static/img/share.png"></button>
  <button open-type="contact" class="contact"><img src="/static/img/wechat.png"></button>
</div>
</template>
<script>
export default {
  name: 'floatBtnGroup',
}
</script>
<style lang="scss" scoped>
.group {
  position: fixed;
  bottom: 20px;
  right: 15px;
  button::after {
    border: none;
  }
  button {
    width: 80rpx;
    height: 80rpx;
    padding: 0;
    margin: 0 0 5px;
    background: rgba(0,0,0,0.48);
    text-align: center;
    color: #fff;
    border-radius: 50%;
    image {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50rpx;
      height: 50rpx;
    }
  }
}
</style>
