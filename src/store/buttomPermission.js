import Cookie from "js-cookie";

const buttomPermission = {
    namespaced: true,
    state: {
        buttomPermission: {}
    },
    mutations: {
        setPermission(state, val) {
            state.buttomPermission = val
            Cookie.set("buttomPermission", JSON.stringify(val));
        },
        addPermission(state) {
            state.buttomPermission = JSON.parse(Cookie.get("buttomPermission"));
        }

    },
  };
  
  export default buttomPermission;
  