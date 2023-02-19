<template>
  <div class="userInfo">
    <div class="leftNav">
      <div class="pic">
        <span class="userImg"> US </span>
        <span>{{ userName }}</span>
      </div>
      <div class="label" >
        <li 
        v-for="(item, index) in nav" 
        :key="index" 
        @click="toInfo(item.path, index)"
        :class="{ active: change === index }"
        >
          <a :class="item.class"></a>
          <span>{{ item.label }}</span>
        </li>
      </div>
    </div>
    <div class="detailInfo">
        <router-view></router-view>
    </div>
    <el-footer>
      <footerMsg />
    </el-footer>
  </div>
</template>

<script>
import { getUserName } from "@/Utils/Token";
import footerMsg from "@/components/footerMsg";

export default {
  name: "userInfo",
  components: { footerMsg },
  data() {
    return {
      userName: "",
      nav: [
        { class: "fa fa-bars", label: "个人信息", path: "/userDetailInfo" },
        { class: "fa fa-shield", label: "安全等级", path: "/userShieldInfo" },
      ],
      // 导航条默认位置
      change: '',
    };
  },
  created() {
      this.userName = getUserName("UserNameKey");
      this.toInfo('/userDetailInfo',0);
  },
  methods:{
    // 导航条
    toInfo(path,index) {
      // 改变导航条样式
      this.change = index;
      this.$router.push({
        path: path,
      })
    
    },
  },
};
</script>

<style lang="less" scoped>
.userInfo {
    margin-top: 60px;
    display: flex;
    justify-content: center;
  .leftNav {
      width: 240px;
      margin-right: 24px;
    .pic {
      width: 100%;
      height: 180px;
      background-color: rgb(255, 255, 255);
      border: 1px #ddd solid;
      border-radius: 8px;
      text-align: center;
      transition: all 1s;
      margin-bottom: 24px;
    .userImg {
      display: block;
      width: 90px;
      line-height: 90px;
      text-align: center;
      background-color: #6b50d9;
      color: #fff;
      font-size: 30px;
      font-weight: 400;
      border-radius: 50%;
      margin: 20px auto;
    }
    }
    .label{
      border: 1px #ddd solid;
      border-radius: 8px;
    transition: all 1s;
      li{
        position:relative;
        line-height: 50px;
        list-style: none;
        padding-left: 30px;
        border-bottom: 1px #ddd solid;
        color: rgb(66, 66, 66);
        font-size: 14px;
        cursor: pointer;
        a{
            margin-right: 10px;
        }
      }
      li:last-child{
      border: 0;
      }
     // 点击激活样式
     .active:before{
        position: absolute;
        left: 0;
        top: 8px;
        display: inline-block;
        content: "";
        height: 34px;
        width: 3px;
        background-color: #006bf7;
      }
      .active{
          color: #006bf7;
      }
    }
  .pic:hover {
    box-shadow: 0 0 6px 4px rgb(245, 245, 245);
  }
  .label:hover {
    box-shadow: 0 0 6px 4px rgb(245, 245, 245);
  }
  }
  .detailInfo {
    width: 800px;
    height: 600px;
    border: 1px #ddd solid;
    border-radius: 8px;
    margin-bottom: 30px;
    transition: all 1s;
  }
  .detailInfo:hover {
    box-shadow: 0 0 6px 4px rgb(245, 245, 245);
  }
    .el-footer {
    min-width: 1280px;
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 0;
  }
}
</style>