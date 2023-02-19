// 引入vue和vueRouter
import Vue from "vue";
import VueRouter from "vue-router";

// 注册
Vue.use(VueRouter);

//消除重复点击同一个路由报错，不影响使用
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "login",
      redirect: "/login",
      hidden: "false",
    },
    {
      path: "/login",
      component: () => import("@/views/login/login"),
      hidden: "false",
    },
    {
      path: "/Home",
      component: () => import("@/views/Home"),
      redirect: "/home",
      children: [
        {
          path: "/home",
          component: () => import("@/views/homePage/homePage"),
        },
      ],
    },
    {
      path: "/Home",
      component: () => import("@/views/Home"),
      redirect: "/home",
      children: [
        {
          path: "/UserInfo",
      name: "UserInfo",
      component: () => import("@/views/UserInfo/UserInfo"),
          redirect: "/userDetailInfo",
          children: [
            {
              path: "/userDetailInfo",
      name: "userDetailInfo",
      component: () => import("@/views/UserInfo/userDetailInfo"),
            },
            {
              path: "/userShieldInfo",
      name: "userShieldInfo",
      component: () => import("@/views/UserInfo/userShieldInfo"),
            },
          ],
        },
      ],
    },
  ],

});
