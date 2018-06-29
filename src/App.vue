<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style lang="scss">
@import url("~mpvue-wxparse/src/wxParse.css");
@import "utils/style/zanui.wxss";
@import "utils/style/global";
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
  height: 275rpx;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.header:after{
  position:absolute;
  left: 0;
  top:0;
  display: block;
  width:100%;
  height: 275rpx;
  line-height: 275rpx;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 5px;
  background-color: rgba(0, 0, 0, 0.3);
  content: attr(data-text);
  color: #FFF;
 }
.text-footer {
  color: #aaa;
  text-align: center;
  font-size: 14px;
  margin: 0px auto;
}
</style>
