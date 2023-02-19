//安装引入cookie,在页面刷新时也可保存数据
import Cookie from "js-cookie";

const menuRouter = {
  namespaced: true,
  mutations: {

    setInfo(state, val) {
      state.userInfo = val;
      Cookie.set("userInfo", JSON.stringify(val));
    },
    clearInfo(state) {
      state.userInfo = [];
      Cookie.remove("userInfo");
    },
  },
  state: {
    userInfo: [],
  },
};

export default menuRouter;
