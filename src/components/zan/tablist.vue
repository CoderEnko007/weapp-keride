<template>
  <div :class="{center: isCenter}">
    <div
      v-for="item in list"
      :key="id"
      class="zan-tab__item"
      :class="{'zan-tab__item--selected': selectedId === item.id }"
      :data-component-id="componentId"
      :data-item-id="item.id"
      @click="__change"
    >
      <div class="zan-tab__title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
  import {extractComponentId} from '../../utils/helper'
  export default {
    props: ['list', 'selectedId', 'componentId', '_handleZanTabChange', 'isCenter'],
    methods: {
      __change (e) {
        const componentId = extractComponentId(e)
        const dataset = e.currentTarget.dataset
        const selectedId = dataset.itemId
        const data = { componentId, selectedId }
        this.$emit('change', data)
      }
    },
  }
</script>

<style scoped>
.zan-tab__title {
  height: 80rpx;
  max-width: 280rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.zan-tab__item--selected .zan-tab__title{
  font-weight: bold;
  color:#206994;
  border-bottom:2px solid #206994;
}
.zan-tab__bd {
  padding-left: 10rpx;
}
.center {
  display: flex;
  width: 100%;
}
</style>
