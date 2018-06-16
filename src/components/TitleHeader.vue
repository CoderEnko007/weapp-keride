<template>
<div class="title-header">
  <h2 class="name">{{name}}</h2>
  <div class="sub">
    <span class="time">{{time}}</span>
    <button open-type="share" class="share">点击分享</button>
  </div>
</div>
</template>
<script>
export default {
  props:['name', 'time'],
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.title-header {
  margin: 5px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #ccc;
  .name {
    font-size: 24px;
  }
  .sub {
    font-size: 12px;
    margin-top: 10px;
    vertical-align: middle;
    .time {
      color: #ccc;
    }
    .share {
      float: right;
      margin-right: 15px;
      font-size: 14px;
      padding: 0;
      border-radius:0;
      height: 20px;
      line-height: 20px;
      background-color: transparent;
      font-weight: bold;
    }
    .share::after {
      border: none;
    }
  }
}

</style>
