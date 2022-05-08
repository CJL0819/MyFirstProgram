<template>
    <div>
        <!-- 行内表单 ,条件查找-->
        <el-form
            :inline="true"
            :model="searchMap"
            ref="searchForm"
            style="margin-top: 20px"
        >
            <el-form-item prop="stunum">
                <el-input
                    v-model="searchMap.stunum"
                    placeholder="学号"
                ></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <el-input
                    v-model="searchMap.name"
                    placeholder="姓名"
                ></el-input>
            </el-form-item>
            <el-form-item prop="teacher">
                <el-input
                    v-model="searchMap.teacher"
                    placeholder="授课教师"
                    readonly
                    @click.native="dialogTeacherVisible = true"
                ></el-input>
            </el-form-item>
            <el-form-item prop="class">
                <el-input
                    v-model="searchMap.class"
                    placeholder="班级"
                ></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleAdd('pojoForm')"
                    >新增</el-button
                >
                <el-button type="primary" @click="searchData">查询</el-button>
                <el-button type="primary" @click="resetForm('searchForm')"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>

        <!--  学生列表 -->
        <el-table :data="tableData" height="380" border style="width: 100%">
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="stunum" label="学号" width="100">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100">
            </el-table-column>
            <el-table-column prop="admissiondate" label="入学时间" width="180">
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="180">
            </el-table-column>
            <el-table-column prop="teacher" label="授课教师" width="100">
            </el-table-column>
            <el-table-column prop="class" label="班级" width="100">
            </el-table-column>
            <el-table-column prop="job" label="工作去向" width="180">
            </el-table-column>
            <el-table-column prop="money" label="薪资" width="100">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row._id)"
                        >编辑</el-button
                    >
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDele(scope.row._id)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <!--  分页功能 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.currentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        >
        </el-pagination>

        <!--  教师信息弹窗 -->
        <el-dialog
            title="选择教师"
            :visible.sync="dialogTeacherVisible"
            width="20%"
        >
            <teacher :isDialog="true" @option-teacher="optionTeacher"></teacher>
        </el-dialog>

        <!--  学生新增或编辑 -->
        <el-dialog
            title="学员编辑"
            :visible.sync="dialogFormVisible"
            width="500px"
        >
            <el-form
                :model="pojo"
                ref="pojoForm"
                :rules="rules"
                label-width="100px"
                lable-position="right"
                style="width: 400px"
            >
                <el-form-item label="学号" prop="stunum">
                    <el-input v-model="pojo.stunum"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="pojo.name"></el-input>
                </el-form-item>
                <el-form-item label="入学时间" prop="admissiondate">
                    <el-date-picker
                        v-model="pojo.admissiondate"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="pojo.phone"></el-input>
                </el-form-item>
                <el-form-item label="授课教师" prop="teacher">
                    <el-input
                        v-model="pojo.teacher"
                        readonly
                        @click.native="dialogOptionTeacher"
                    ></el-input>
                </el-form-item>
                <el-form-item label="所在班级" prop="class">
                    <el-input v-model="pojo.class"></el-input>
                </el-form-item>
                <el-form-item label="工作去向" prop="job">
                    <el-input v-model="pojo.job"></el-input>
                </el-form-item>
                <el-form-item label="薪资" prop="money">
                    <el-input v-model="pojo.money"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dialogFormVisible = false"
                        >取消</el-button
                    >
                    <el-button
                        type="primary"
                        @click="
                            pojo._id === null
                                ? addData('pojoForm')
                                : updateData('pojoForm')
                        "
                        >提交</el-button
                    >
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>


<script>
import studentApi from "@/api/student.js";
import Teacher from "@/views/teacher/index.vue"; //子组件
export default {
    data() {
        return {
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            searchMap: {
                stunum: "",
                name: "",
                teacher: "",
                class: "",
            },
            pojo: {
                _id: null,
                stunum: "",
                name: "",
                teacher: "",
                class: "",
                admissiondate: "",
                phone: "",
                job: "",
                money: "",
            },
            dialogTeacherVisible: false,
            dialogFormVisible: false,
            isEdit: false,
            rules: {
                stunum: [
                    {
                        required: true,
                        message: "学号不能为空",
                        trigger: "blur",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: "姓名不能为空",
                        trigger: "blur",
                    },
                ],
                teacher: [
                    {
                        required: true,
                        message: "授课不能为空",
                        trigger: "blur",
                    },
                ],
                class: [
                    {
                        required: true,
                        message: "所在班级不能为空",
                        trigger: "blur",
                    },
                ],
                admissiondate: [
                    {
                        required: true,
                        message: "入学时间不能为空",
                        trigger: "blur",
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: "电话不能为空",
                        trigger: "blur",
                    },
                ],
                job: [
                    {
                        required: true,
                        message: "工作去向不能为空",
                        trigger: "blur",
                    },
                ],
                money: [
                    {
                        required: true,
                        message: "薪资不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },

    components: {
        Teacher, //注册子组件
    },

    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            studentApi
                .search(this.currentPage, this.pageSize, this.searchMap)
                .then((response) => {
                    // console.log(response.data);
                    this.tableData = response.data.data.rows;
                    this.total = response.data.data.total;
                });
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.fetchData();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.fetchData();
        },
        //学员信息编辑  显示窗口并显示查询的学员信息
        handleEdit(id) {
            // console.log("编辑");
            // console.log(id);
            this.handleAdd("pojoForm");
            studentApi.getById(id).then((response) => {
                const resp = response.data;
                // console.log(resp);
                if (resp.flag) {
                    this.pojo = resp.data;
                }
            });
        },
        //学员信息编辑 修改完信息后点击提交
        updateData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    studentApi.update(this.pojo).then((response) => {
                        const resp = response.data;
                        if (resp.flag) {
                            this.fetchData();
                            this.dialogFormVisible = false;
                        } else {
                            this.$message({
                                message: resp.message,
                                type: "warning",
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        //学员信息删除
        handleDele(id) {
            this.$confirm("确认删除这条记录吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    // 确认
                    studentApi.deleteById(id).then((response) => {
                        const resp = response.data;
                        //提示
                        this.$message({
                            message: resp.message,
                            type: resp.flag ? "success" : "error",
                        });
                        if (resp.flag) {
                            this.fetchData();
                        }
                    });
                })
                .catch(() => {
                    // 取消删除，不理会
                    this.$message({
                        message: "已取消删除",
                        type: "info",
                    });
                });
        },
        searchData() {
            this.currentPage = 1;
            this.fetchData();
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.fetchData();
        },
        optionTeacher(currentRow) {
            // ？？？？？？？？？？？？？
            // console.log("student", currentRow);
            if (currentRow) {
                if (this.isEdit) {
                    this.pojo.teacher = currentRow.name;
                } else {
                    this.searchMap.teacher = currentRow.name;
                }
                this.isEdit = false;
                this.dialogTeacherVisible = false;
            }
        },
        //新增教师 清空窗口内容并显示窗口
        handleAdd(formName) {
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs[formName].resetFields();
            });
        },
        //新增中选择授课教师
        dialogOptionTeacher() {
            this.isEdit = true;
            this.dialogTeacherVisible = true;
        },
        //新增教师 点击提交时调用
        addData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    studentApi.add(this.pojo).then((response) => {
                        const resp = response.data;
                        if (resp.flag) {
                            this.fetchData();
                            this.dialogFormVisible = false;
                        } else {
                            this.$message({
                                message: resp.message,
                                type: "warning",
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
</style>