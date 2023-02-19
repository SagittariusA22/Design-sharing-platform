import Vue from "vue";
import Vuex from "vuex";
import menuRouter from "./menuRouter";
import vipProject from "./vipProject";
import buttomPermission from "./buttomPermission";
import userInfo from "./userInfo";

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    menuRouter,
    vipProject,
    buttomPermission,
    userInfo
  },
});
