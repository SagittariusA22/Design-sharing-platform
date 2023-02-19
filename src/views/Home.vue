<template>
  <div class="home">
    <el-container>
      <el-header style="height: 70px">
        <headerMenu />
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import headerMenu from "@/components/headerMenu.vue";

export default {
  name: "Home",
  components: { headerMenu,  },
  watch: {
    $route: function (to, from) {
      document.documentElement.scrollTop = 0;
    },
  },
};
</script>

<style lang='less' scoped>
.home {
  height: 100%;
  width: 100%;
  position: relative;
  .el-header {
    position: fixed;
    top: 0;
    z-index: 3;
    width: 100%;
    min-width: 1280px;
  }
  .el-header{
    padding: 0;
    margin: 0;
  }
  .el-main {
    width: 100%;
    padding: 0;
    margin-top: 70px;
    min-width: 1280px;
    min-height: 720px;
    // z-index: 1;
  }
}
</style>
