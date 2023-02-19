import VirtuaScroll from "./VirtuaScroll.vue"
import VirtuaScrollUp from "./VirtuaScrollUp.vue"

const plugin = {
    install (Vue){
        Vue.component("VirtuaScroll", VirtuaScroll);  /* 插件名称和插件 */
        Vue.component("VirtuaScrollUp", VirtuaScrollUp);  
    }
};

export default plugin;