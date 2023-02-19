<template>
  <div class="headerMenu">
    <div class="title">
      <img src="@/assets/img/LOGO.png" />
      <span>知识管理平台</span>
    </div>
    <router-link to="/Home" class="home">首页</router-link>
    <!-- menu -->
    <div class="menu">
      <el-menu class="el-menu-demo" mode="horizontal" router>
        <template v-for="(item, index) in menu">
          <el-submenu :key="index" :index="index + ''" v-if="!item.hidden">
            <template slot="title">{{ item.name }}</template>

            <!--二级标签 -->
            <el-menu-item-group
              v-for="(child, index) in item.children"
              :key="index"
              style="padding-left: 10px"
            >
              <!-- index必须指定为path,则可以点击跳转 -->
              <el-menu-item :index="child.path" v-if="!child.hidden">
                {{ child.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </el-menu>
    </div>
    <!-- 用户中心 -->
    <div class="headerRight">
      <el-dropdown trigger="click">
        <img :src="userImg" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user-solid"  @click.native="userInfo"
            >用户中心</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-remove" @click.native="quit"
            >退出登录</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { removeToken, removeUserName } from "@/Utils/Token";

export default {
  name: "headerMenu",
  data() {
    return {
      userImg: require("../assets/img/user.png"),
      menu: [],
    };
  },
  methods: {
    quit() {
      removeToken("token");
      removeUserName("UserNameKey");
      this.$store.commit("menuRouter/clearMenu");
      location.reload();
      this.$router.push("/login");
    },
    userInfo() {
      this.$router.push("/UserInfo");
    },
  },
  created() {
    this.menu = this.$store.state.menuRouter.menu;
  },
};
</script>

<style lang="less" scope>
.headerMenu {
  height: 70px;
  padding: 0;
  margin: 0;
  display: flex;
  width: 100%;
  background-color: rgb(255, 255, 255);
  justify-content: flex-end;
  align-items: center;
  .title {
    position: absolute;
    left: 40px;
    display: flex;
    font-weight: bold;
    font-size: 20px;
    color: rgb(66, 66, 66);
    align-items: center;
    img {
      height: 30px;
      margin-right: 12px;
    }
  }
  .home {
    margin-right: 25px;
    text-decoration: none;
    font-size: 15px;
    color: rgb(139, 139, 139);
  }
  .home:hover {
    color: rgb(56, 56, 56);
  }
  .menu {
    height: 100%;
    .el-menu-demo {
      background-color: transparent;
      border: 0;
      height: 100%;
      .el-submenu {
        margin-top: 5px;
        margin-left: -16px;
      }
    }
  }
  .headerRight {
    margin-right: 40px;
    margin-left: 60px;
    img {
      height: 44px;
      width: 44px;
      //图片不变形
      object-fit: cover;
      border-radius: 50%;
    }
  }
}
</style>