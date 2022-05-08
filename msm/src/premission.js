import router from "./router/index.js"
import { getUserInfo } from "./api/login.js"

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("msm-token");
    if (!token) {
        if (to.path === "/login" || to.path === "/register") {
            next();
        } else {
            next({
                path: "/login"
            })
        }
    } else {
        if (to.path === "/login") {
            next();
        } else if (to.path === "/register") {
            next();
        } else {
            getUserInfo(JSON.parse(localStorage.getItem('msm-user')).username).then(response => {
                const resp = response.data;
                if (resp.flag) {
                    localStorage.setItem("msm-user", JSON.stringify(resp.data));
                    next();
                } else {
                    next({
                        path: "/login"
                    })
                }
            })
        }
    }
})