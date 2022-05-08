<template>
    <div>
        <!--  面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: $route.path }">{{
                $route.meta.title
            }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },

    components: {},

    methods: {},
};
</script>

<style scoped>
.el-breadcrumb {
    height: 10px;
    padding: 20px;
    margin-bottom: 4px;
    border-radius: 4px;
    text-align: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
}

.line {
    border-left: 3px soild rgba(0, 243, 32, 0.2);
    padding: 10px;
}
</style>