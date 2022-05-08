<template>
    <div id="app">
        <!--  路由组件渲染出口 -->
        <router-view></router-view>
    </div>
</template>

<script>
import { token } from "./api/token";
import router from "./router/index";
export default {
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            token().then((response) => {
                const resp = response.data;
                if (!resp.flag) {
                    localStorage.removeItem("msm-token");
                    localStorage.removeItem("msm-user");
                    router.replace("/").catch((err) => {});
                }
            });
        },
    },
};
</script>
<style scoped>
body {
    font-family: "微软雅黑";
}
</style>
