<template>
  <div class="login">
    <div class="background"></div>
    <el-card class="box-card" shadow="hover" >
      <div>
        <span class="eng">PTAD</span>
        <span class="title">知识管理平台</span>
        <span class="type">账号登录</span>
        <div class="line"></div>
      </div>
      <el-form
        label-width="80px"
        :model="loginForm"
        ref="loginForm"
        :rules="rules"
      >
        <el-form-item label="" prop="username" >
          <el-input v-model="loginForm.username" placeholder="请输入用户名 / 手机号码 / 邮箱"></el-input>
          <span class="fa fa-user"></span>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="loginForm.password" :type="showPassword" placeholder="请输入密码"></el-input>
          <span class="fa fa-lock"></span>
          <span class="fa fa-low-vision" v-show="isshowPassword" @click="handlePassword(true)"></span>
          <span class="fa fa-eye" v-show="!isshowPassword" @click="handlePassword(false)"></span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login(loginForm)">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { passRule, nameRule } from "@/Utils/Validate";
import { setToken, setUserName } from "@/Utils/Token.js";
import { login, } from "@/api/api.js";

export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ validator: nameRule, trigger: blur }],
        password: [{ validator: passRule, trigger: blur }],
      },
      showPassword: "password",
      isshowPassword: true,
    };
  },
  methods: {
    login(loginForm) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 封装axios与登录api
          login(this.loginForm).then((respones) => {
            setToken("username", respones.data.username);
            setToken("token", respones.data.token);
            setUserName( "UserNameKey",  respones.data.username );
            this.$store.commit('menuRouter/clearMenu')
            this.$store.commit('menuRouter/setMenu', respones.data.data.menu)
            this.$store.commit('menuRouter/addMenu', this.$router)
            this.$store.commit('userInfo/clearInfo')
            this.$store.commit('userInfo/setInfo', respones.data.info)
            // 按钮权限的设置
            this.$store.commit('buttomPermission/setPermission', respones.data.permission)

              // 弹出登录成功
              this.$message({ message: "登录成功", type: "success" });
              //路由跳转
              this.$router.push("/Home");
          });
        } 
      });
    },
    // 密码显示
    handlePassword(val){
      if(val){
        this.showPassword = "";
        this.isshowPassword = false;
      }else{
        this.showPassword = "password";
        this.isshowPassword = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>

.login {
    width: 100%;
    height: 100%;
display: flex;      
min-width: 1280px;
      min-height: 720px;
  .background{
    background-image: url('@/assets/Login1.jpg');
    background-position:center center;
    background-repeat: no-repeat, repeat;
    background-size: cover, auto;
    width: 50%;
    height: 100%;
  }
  .el-card {
    padding: 0 50px;
    width: 480px;
    height: 720px;
    margin: auto auto;
    span{
      display: block;
      color: rgb(40, 40, 40);
    }
    .eng{
      font-size: 50px;
      font-weight: 600;
      margin-top: 50px;
      margin-bottom: 15px;
    }
    .title{
      font-size: 24px;
      font-weight: 560;
      margin-bottom: 70px;

    }
    .type{
      display: inline-block;
      font-size: 14px;
      padding-bottom: 15px; 
      color: #006bf7;
      border-bottom: 2px #006bf7 solid;
    }
    .line{
      height: 1px;
      width: 100%;
      background-color: rgb(230, 230, 230);
      margin-bottom: 30px;
    }
    .el-form-item{
      position: relative;
      span{
        position: absolute;
        font-size: 22px;
        color: rgb(143, 143, 143);
        top: 0;
        line-height: 50px;
        margin-left: 15px;
      }
      .fa-low-vision, .fa-eye{
        cursor: pointer;
        margin-right: 15px;
        right: 0;
      }
    }
    /deep/ .el-form-item__content{
    margin-left: 0 !important ;
}
      /deep/.el-input__inner{
        background-color: rgb(248, 248, 248) !important;
        border: 0;
        border-radius: 8px;
        height: 50px;
        margin-bottom: 10px;
        padding-left: 50px;
      }
    .el-button {
      width: 100%;
        margin-top: 20px;
        height: 50px;
        border-radius: 8px;
    }
  }
}


</style>