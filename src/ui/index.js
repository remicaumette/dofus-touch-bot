import Vue from "vue";
import {client} from "../dofus";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = process.env.PRODUCTION !== "true";

window.vue = new Vue({
    el: "#root",
    router,
    render: h => h(App)
});

window.client = new client.Client();
