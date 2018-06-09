<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style lang="scss">
@import "../static/style/zanui.wxss";
@import "../static/style/global";
* {
  box-sizing: border-box;
}
.primary {
  color: $primary
}
.bg-primary {
  background-color: $primary;
}
.title {
   position: relative;
   font-size: 18px;
   height: 30px;
 }
.title::after {
  position: absolute;
  top: 15px;
  left: 0;
  bottom: 0;
  content: '';
  width: 30px;
  border-bottom: 3px solid white;
}
.header {
  position: relative;
  width: 100%;
  img {
    width: 100%;
    height: 250rpx;
  }
  .hTitle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150px;
    height: 40px;
    line-height: 40px;
    margin-top: -20px;
    margin-left: -75px;
    color: white;
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 5px;
    text-align: center;
  }
}
</style>
