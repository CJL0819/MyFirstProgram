<template>
    <div class="login-container">
        <el-form
            :model="form"
            status-icon
            :rules="rules"
            ref="form"
            label-width="100px"
            class="login-form"
        >
            <h2 class="login-title">登录</h2>
            <el-form-item label="账号" prop="username">
                <el-input
                    type="username"
                    v-model="form.username"
                    autocomplete="off"
                ></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input
                    type="password"
                    v-model="form.password"
                    autocomplete="off"
                ></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('form')"
                    >登录</el-button
                >
                <el-button @click="goRegister">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { login, getUserInfo } from "@/api/login";
export default {
    data() {
        return {
            form: {
                username: "1",
                password: "1",
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: "账号不能为空",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    login(this.form.username, this.form.password).then(
                        (response) => {
                            const resp = response.data;
                            // console.log("resp", resp);
                            if (resp.flag) {
                                // console.log("resp", resp);
                                getUserInfo(this.form.username).then(
                                    (response) => {
                                        const respUser = response.data;
                                        if (respUser.flag) {
                                            // console.log("user", respUser);
                                            localStorage.setItem(
                                                "msm-token",
                                                resp.data.token
                                            );
                                            localStorage.setItem(
                                                "msm-user",
                                                JSON.stringify(respUser.data)
                                            );
                                            this.$router.push("/");
                                        } else {
                                            this.$message({
                                                message: respUser.message,
                                                type: "error",
                                            });
                                        }
                                    }
                                );
                            } else {
                                this.$message({
                                    message: resp.message,
                                    type: "error",
                                });
                            }
                        }
                    );
                } else {
                    console.log("error submit");
                    return false;
                }
            });
        },
        goRegister() {
            this.$router.push("/register");
        },
    },
};
</script>

<style scoped>
.login-container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url(../../assets/bj.jpeg);
    background-size: cover;
}

.login-form {
    width: 350px;
    margin: 169px auto;
    background-color: aliceblue;
    padding: 30px;
    border-radius: 20px;
}

.login-title {
    text-align: center;
}
</style>