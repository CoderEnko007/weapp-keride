<template>
<div class="group">
  <button class="home" @click="backToHomePage"></button>
  <button open-type="share" class="share"></button>
  <button open-type="contact" class="contact"></button>
</div>
</template>
<script>
export default {
  name: 'SuspBtnGroup',
  methods: {
    backToHomePage() {

    }
  }
}
</script>
<style lang="scss" scoped>

</style>
