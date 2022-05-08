<template>
    <div>
        <!-- 头部区域 -->
        <a href="">
            <img class="logo" src="@/assets/logo.png" width="25px" />
            <span class="company">成员管理系统</span>
        </a>

        <!--  修改密码 -->
        <el-dialog
            title="修改密码"
            :visible.sync="dialogFormVisible"
            width="500px"
        >
            <el-form
                :model="ruleForm"
                ref="ruleForm"
                label-width="100px"
                label-position="right"
                style="width: 400px"
                :rules="rules"
                status-icon
            >
                <el-form-item label="原密码" prop="oldPass">
                    <el-input
                        v-model="ruleForm.oldPass"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input
                        v-model="ruleForm.pass"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input
                        v-model="ruleForm.checkPass"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')"
                        >提交</el-button
                    >
                    <el-button @click="$refs['ruleForm'].resetFields()"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{ user.nickname
                }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">修改密码</el-dropdown-item>
                <el-dropdown-item command="b">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import { logout } from "@/api/login.js";
import passwordApi from "@/api/password.js";
export default {
    data() {
        var validateOldPass = (rule, value, callback) => {
            passwordApi.checkPwd(this.user.username, value).then((response) => {
                const resp = response.data;
                if (resp.flag) {
                    callback();
                } else {
                    callback(new Error(resp.message));
                }
            });
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            user: JSON.parse(localStorage.getItem("msm-user")),
            dialogFormVisible: false,
            ruleForm: {
                oldPass: "",
                pass: "",
                checkPass: "",
            },
            rules: {
                oldPass: [
                    { required: true, message: "原始密码不能为空" },
                    { validator: validateOldPass, trigger: "blur" },
                ],
                pass: [
                    {
                        required: true,
                        message: "新密码不能为空",
                        trigger: "blur",
                    },
                ],
                checkPass: [
                    { required: true, message: "确认密码不能为空" },
                    { validator: validatePass2, trigger: "blur" },
                ],
            },
        };
    },

    components: {},

    methods: {
        handleCommand(command) {
            // this.$message("click on item " + command);
            switch (command) {
                case "a":
                    //修改密码
                    this.handlePwd();
                    break;
                case "b":
                    //退出系统
                    this.handleLogout();
                    break;
                default:
                    break;
            }
        },
        //退出登录
        handleLogout() {
            logout().then((response) => {
                const resp = response.data;
                if (resp.flag) {
                    localStorage.removeItem("msm-token");
                    localStorage.removeItem("msm-user");
                    this.$message({
                        message: resp.message,
                        type: "success",
                    });
                    this.$router.push("/login");
                }
            });
        },
        //修改密码
        handlePwd() {
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["ruleForm"].resetFields();
            });
        },
        //修改密码提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // alert("提交成功");
                    if (valid) {
                        passwordApi
                            .updatePwd(this.user._id, this.ruleForm.checkPass)
                            .then((response) => {
                                const resp = response.data;
                                this.$message({
                                    message: resp.message,
                                    type: resp.flag ? "success" : "error",
                                });
                                if (resp.flag) {
                                    this.handleLogout();
                                    this.dialogFormVisible = false;
                                }
                            });
                    }
                } else {
                    // 验证不通过
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.logo {
    padding: 0 10px 0 20px;
    vertical-align: middle;
}
.company {
    position: absolute;
    color: white;
}
.el-dropdown-link {
    cursor: pointer;
    color: white;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.el-dropdown {
    float: right;
    margin-right: 20px;
}
</style>