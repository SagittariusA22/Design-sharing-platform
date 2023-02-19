<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
}
</script>

<style lang='less'>
//重置样式
@import url('./assets/css/reset.css');
html, body {
  width: 100%;
  height: 100%;
  min-width:1280px;
  min-height:720;
}
#app{
  // height: 100vh;
    width: 100%;
  height: 100%;
}

</style>
