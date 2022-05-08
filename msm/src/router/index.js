import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
    {
        path: "/register",
        name: "register",
        component: () => import("../views/register")
    }, {
        path: "/login",
        name: "login",
        component: () => import("../views/login")
    }, {
        path: "/",
        name: "layout",
        component: () => import("../components/layout.vue"),
        redirect: "/home",
        children: [//第一种子组件写法
            {
                path: "/home",
                component: () => import("../views/home"),
                meta: { title: "ROOT" }
            }
        ]
    }, {//第二种子组件写法
        path: "/teacher",
        component: () => import("../components/layout.vue"),
        children: [
            {
                path: "/",
                component: () => import("../views/teacher"),
                meta: { title: "教师信息管理" }
            }
        ]
    }, {
        path: "/student",
        component: () => import("../components/layout.vue"),
        children: [
            {
                path: "/",
                component: () => import("../views/student"),
                meta: { title: "学生信息管理" }
            }
        ]
    }
];

const router = new VueRouter({
    mode: "hash",
    base: process.env.BASE_URL,
    routes,
});
// console.log(process.env.BASE_URL);

export default router;
