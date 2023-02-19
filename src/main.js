import Vue from "vue";
import App from "./App.vue";
import plugins from "./Plugins/Element-ui";
import "font-awesome/css/font-awesome.min.css";
import router from "@/router/router";
import store from "./store/index";
import axios from "axios";
import { getToken } from "@/Utils/Token";
import { Message } from "element-ui";
import { MessageBox } from "element-ui";


import AOS from 'aos';
import 'aos/dist/aos.css';
import "./mock/";

// 插件 VirtuaScroll
import VirtuaScroll from "@/Plugins";
import VirtuaScrollUp from "@/Plugins";
Vue.use(VirtuaScroll);
Vue.use(VirtuaScrollUp);

import { Loading } from 'element-ui';
Vue.use(Loading);    // 使用服务方式的话，只安装Loading即可
Vue.use(Loading.directive);  //  指令方式(v-loading)的话这两行都得有

Vue.prototype.axios = axios;
Vue.prototype.$confirm = MessageBox.confirm;
AOS.init();

// message弹出多次的问题
import {message} from '@/Utils/resetMessage';
Vue.prototype.$message = message;

// import * as xlsx from 'xlsx/xlsx.mjs'
// Vue.use(xlsx)

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken("token");
  if (!token && to.path !== "/login") {
    next({ path: "/login" });
  } else if (token && to.path === "/login") {
    /* 登录时就不能访问到login页面 */
    next({ path: "/Home" });
  } else {
    next();
  }
});

new Vue({
  render: (h) => h(App),
  router,
  store,

  beforeCreate() {
    // 全局事件总线，uploading清空使用
		Vue.prototype.$bus = this //安装全局事件总线，$bus就是当前应用的vm
	},
  created() {
    // 刷新空白页
    store.commit("menuRouter/addMenu", router);
    // 刷新 vuex按钮权限 设置
    store.commit("buttomPermission/addPermission");
  },
}).$mount("#app");
