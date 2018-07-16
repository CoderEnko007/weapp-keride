<template>
<div class="card-list">
  <div class="zan-card" v-for="item in list" :key="item.id" @click="handleClick(item)">
    <div class="zan-card__thumb">
      <image class="zan-card__img" :src= item.image mode="aspectFill"></image>
    </div>
    <div class="zan-card__detail">
      <div class="zan-card__detail-row">
        <div class="zan-ellipsis news-title">{{item.title}}</div>
      </div>
      <div class="zan-card__detail-row zan-c-gray-darker">
        <div class="zan-ellipsis--l2 small-font">{{item.desc}}</div>
      </div>
      <div class="zan-card__detail-row zan-c-gray-darker">
        <div class="zan-card__right-col small-font">{{item.create_time}}</div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'CardBoard',
  props: ['list'],
  methods: {
    handleClick(item) {
      this.$emit('cardClick', item.id)
    }
  },
}
</script>
<style lang="scss" scoped>
  .zan-card {
    border-bottom: 1px solid #EEE;
    .zan-card__thumb {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      .zan-card__img {
        border-radius: 10px 0;
      }
    }
    .zan-card__detail {
      .zan-card__detail-row {
        margin-bottom: 15rpx;
        .news-title {
          font-weight: bold;
          margin-top: 5px;
        }
        .small-font {
          font-size: 12px;
        }
        .zan-card__right-col {
          margin-right: 40rpx;
        }
      }
    }
  }
  .zan-card:active {
    background: #CCC;
  }
</style>
