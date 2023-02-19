<template>
  <div class="home">
        <keep-alive> 
        <router-view></router-view>
        </keep-alive>
  </div>
</template>

<script>
export default {
  name: "index",
};
</script>

<style lang='less' scoped>
.home{
  height: 100%;
  width:  100%;
  }
</style>
