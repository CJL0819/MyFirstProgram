<template>
    <div>
        <h1 style="text-align: center">欢迎使用物业管理信息系统</h1>
        <div class="img"></div>
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
.img {
    position: absolute;
    width: 700px;
    height: 420px;
    left: 50%;
    top: 50%;
    transform: translate(-350px, -210px);
    overflow: hidden;
    background: url(../../assets/bj.jpeg);
    background-size: cover;
}
</style>