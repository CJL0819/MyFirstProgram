import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUi from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./premission.js"

Vue.config.productionTip = false;
Vue.use(ElementUi);
// console.log(process.env.VUE_APP_BASE_API);

new Vue({
    router,
    render: (h) => h(App),

}).$mount("#app");
