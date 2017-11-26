import Vue from "vue";
import Router from "vue-router";
import Home from "../components/Home.vue";
import Login from "../components/Login.vue";

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: "/",
            component: Home
        },
        {
            path: "/login",
            component: Login
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (/*window.client.state == window.client.states.ONLINE && */ to.path !== "/login") {
        next("/login");
    } else {
        next();
    }
});

export default router;
