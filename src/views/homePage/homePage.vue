<template>
  <div class="homePage">
    <!-- 轮播图 -->
    <el-carousel :interval="3500" arrow="always" height="35vw">
      <el-carousel-item v-for="(item, index) in Img" :key="index">
        <img :src="item.url" :alt="item.alt" />
      </el-carousel-item>
    </el-carousel>
    <!--精品项目展示-->
    <proDisplay/>

      <el-footer>
        <footerMsg />
      </el-footer>
  </div>
</template>

<script>
import { getImg, } from "@/api/api";
import proDisplay from "@/components/proDisplay"
import footerMsg from "@/components/footerMsg";


export default {
  name: "homePage",
  components:{ proDisplay, footerMsg },
  data() {
    return {
      Img: [],
    };
  },
  created() {
    this.displayImg();
  },
  methods: {
    displayImg() {
      getImg().then((res) => {
        this.Img = res.data.data.displayImg;
      })
    },
  },
};
</script>

<style lang="less" scoped>
.homePage {
  width: 100%;
  overflow: hidden;
}
.el-carousel{
  z-index: 0;
}
.el-carousel__item img {
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
}
  .el-footer {
    width: 100%;
    padding: 0;
  }
</style>