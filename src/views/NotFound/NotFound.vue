<template>
  <div class="notfound">
      <span @click="backHome">返回首页</span> 
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    backHome(){
      this.$router.push({
        path: "/"
      })
    }
  },
};
</script>

<style lang="less" scoped>
.notfound {
  height: 100%;
  background-image: url('@/assets/404.jpg');
  background-position: right top, center center;
  background-repeat: no-repeat, repeat;
  background-size: cover, auto;

    span{
      position: relative;
      top: 650px;
      display: block;
      margin: 0 auto;
      height: 50px;
      width: 200px;
      text-align: center;
      line-height: 50px;
    border-radius: 25px;
    background-color: #2483ff;
    font-size: 17px;
    color: #fff;
    cursor: pointer;
    }
  
}

</style>