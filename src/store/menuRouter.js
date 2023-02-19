//安装引入cookie,在页面刷新时也可保存数据
import Cookie from "js-cookie";

const menuRouter = {
  namespaced: true,
  mutations: {
    // menu 的设置及清除
    setMenu(state, val) {
      state.menu = val;
      Cookie.set("menu", JSON.stringify(val));
    },
    clearMenu(state) {
      state.menu = [];
      Cookie.remove("menu");
    },
    // menu路径拼接。以便可动态添加route
    addMenu(state, router) {
      // 没有路由menu则返回
      if (!Cookie.get("menu")) {
        return;
      }
      // 读取cookie 里面的 menu
      state.menu = JSON.parse(Cookie.get("menu"));
      const menuConvert = [];
      state.menu.forEach((item) => {
        if (item.children) {
          item.component = () => import(`@/views/${item.url}`);

          item.children = item.children.map((item) => {
            item.component = () => import(`@/views/${item.url}`);
            return item;
          });

          item.children.forEach((item) => {
            if (item.children) {
              item.component = () => import(`@/views/${item.url}`);

              item.children = item.children.map((item) => {
                item.component = () => import(`@/views/${item.url}`);
                return item;
              });
    
            }
          })
          
          menuConvert.push(item);
        } else {
          item.component = () => import(`@/views/${item.url}`);
          menuConvert.push(item);
        }
      });

      //动态添加路由
      menuConvert.forEach((item) => {
        
        router.addRoute(item);
      });
    },
  },
  state: {
    menu: [],
  },
};

export default menuRouter;
