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
$primary: #206994;
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
</style>
