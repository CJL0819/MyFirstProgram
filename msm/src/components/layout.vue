<template>
    <div>
        <div class="header">
            <app-header></app-header>
        </div>
        <div class="navbar">
            <app-navbar></app-navbar>
        </div>
        <div class="main">
            <app-main></app-main>
        </div>
    </div>
</template>

<script>
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import AppMain from "./AppMain";
export default {
    data() {
        return {};
    },

    components: {
        AppHeader,
        AppNavbar,
        AppMain,
    },

    methods: {},
};
</script>

<style scoped>
.header {
    position: absolute;
    line-height: 50px;
    padding: 0px;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: rgb(77, 85, 99);
}

.navbar {
    position: absolute;
    width: 230px;
    top: 50px;
    left: 0px;
    bottom: 0px;
    overflow: auto;
    background-color: #545c64;
}

.main {
    position: absolute;
    top: 50px;
    left: 230px;
    right: 0px;
    bottom: 0px;
    overflow-y: auto;
    background-color: rgb(255, 255, 255);
    padding: 10px;
}
</style>