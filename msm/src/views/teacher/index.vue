<template>
    <div>
        <!-- 教师管理 -->

        <!--  条件查询 -->
        <el-form
            :inline="true"
            ref="searchMap"
            :model="searchMap"
            class="demo-form-inline"
            style="margin-top: 20px"
        >
            <el-form-item prop="jobnumber">
                <el-input
                    v-model="searchMap.jobnumber"
                    placeholder="工号"
                    v-if="!isDialog"
                ></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <el-input
                    v-model="searchMap.name"
                    placeholder="姓名"
                ></el-input>
            </el-form-item>
            <el-form-item prop="role">
                <el-select
                    v-model="searchMap.role"
                    placeholder="教师职务"
                    v-if="!isDialog"
                >
                    <el-option
                        v-for="option in roleOptions"
                        :key="option.type"
                        :label="option.name"
                        :value="option.type"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="entrydate">
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="searchMap.entrydate"
                    type="date"
                    placeholder="入职日期"
                    v-if="!isDialog"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="handleAdd('teacherForm')"
                    v-if="!isDialog"
                    >新增</el-button
                >
                <el-button type="primary" @click="searchData">查询</el-button>
                <el-button
                    type="primary"
                    @click="resetForm('searchMap')"
                    v-if="!isDialog"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>
        <!-- 教师列表 -->
        <!--  hightlight-current-row激活单选行，isDialog 为true时激活
      @current-change 当带点击某一行时，触发该事件，调用相应的方法传两个参数：currentRow，oldCurrentRow
    -->
        <el-table
            :data="tableData"
            height="380"
            border
            style="width: 100%"
            :hightlight-current-row="isDialog"
            @current-change="clickCurrentChange"
        >
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column
                prop="jobnumber"
                label="工号"
                width="180"
                v-if="!isDialog"
            >
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="role" label="职务" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.role | roleFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="entrydate"
                label="入职时间"
                width="180"
                v-if="!isDialog"
            >
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="180">
            </el-table-column>
            <el-table-column label="操作" width="180" v-if="!isDialog">
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
            :page-size="this.pageSize"
            :layout="
                isDialog
                    ? 'prev,pager,next'
                    : 'total, sizes, prev, pager, next, jumper'
            "
            :total="this.total"
        >
        </el-pagination>

        <!-- 新增教师弹窗 -->
        <el-dialog
            title="教师信息编辑"
            :visible.sync="dialogFormVisible"
            width="500px"
        >
            <el-form
                :model="teacher"
                ref="teacherForm"
                label-width="100px"
                label-position="right"
                style="width: 400px"
                :rules="rules"
                status-icon
            >
                <el-form-item label="工号" prop="jobnumber">
                    <el-input
                        v-model="teacher.jobnumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input
                        v-model="teacher.name"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="职务" prop="role">
                    <el-select v-model="teacher.role" placeholder="请选择...">
                        <el-option
                            v-for="option in roleOptions"
                            :key="option.type"
                            :label="option.name"
                            :value="option.type"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入职时间" prop="entrydate">
                    <el-date-picker
                        v-model="teacher.entrydate"
                        type="date"
                        placeholder="请点击选择"
                        value-format="yyyy-MM-dd"
                    />
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input
                        v-model="teacher.phone"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="
                        teacher._id === null
                            ? addData('teacherForm')
                            : updateData('teacherForm')
                    "
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import teacherApi from "@/api/teacher.js";
const roleOptions = [
    { type: "1", name: "教师" },
    { type: "2", name: "班主任" },
];

export default {
    data() {
        return {
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            searchMap: {
                jobnumber: "",
                name: "",
                role: "",
                entrydate: "",
            },
            roleOptions: roleOptions,
            teacher: {
                _id: null,
                jobnumber: "",
                name: "",
                role: "",
                entrydate: "",
                phone: "",
            },
            dialogFormVisible: false,
            rules: {
                jobnumber: [
                    { required: true, message: "请输入工号", trigger: "blur" },
                ],
                name: [
                    { required: true, message: "请输入姓名", trigger: "blur" },
                ],
            },
        };
    },

    filters: {
        roleFilter(type) {
            const obj = roleOptions.find((item) => item.type === type);
            return obj ? obj.name : null;
        },
    },

    props: { isDialog: Boolean },

    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            teacherApi
                .search(this.currentPage, this.pageSize, this.searchMap)
                .then((response) => {
                    const resp = response.data;
                    this.tableData = resp.data.rows;
                    this.total = resp.data.total;
                });
        },
        handleEdit(id) {
            // console.log(id);
            this.handleAdd("teacherForm");
            teacherApi.getById(id).then((response) => {
                const resp = response.data;
                if (resp.flag) {
                    this.teacher = resp.data;
                }
            });
        },
        updateData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    teacherApi.update(this.teacher).then((response) => {
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
        handleDele(id) {
            console.log("删除");
            this.$confirm("确认删除这条记录吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    // 确认
                    teacherApi.deleteById(id).then((response) => {
                        const resp = response.data;
                        console.log(resp);
                        //提示信息
                        this.$message({
                            type: resp.flag ? "success" : "error",
                            message: resp.message,
                        });
                        if (resp.flag) {
                            // 删除成功，刷新列表
                            this.fetchData();
                        }
                    });
                })
                .catch(() => {
                    // 取消删除，不理会
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
        handleAdd(formName) {
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs[formName].resetFields();
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
        addData(formName) {
            this.$refs[formName].validate((item) => {
                if (item) {
                    // alert("add");
                    teacherApi.add(this.teacher).then((response) => {
                        const resp = response.data;
                        if (resp.flag) {
                            this.fetchData();
                            this.dialogFormVisible = false;
                            this.$message({
                                message: "添加教师信息成功",
                                type: "success",
                            });
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
        // 单选一条信息
        clickCurrentChange(currentRow) {
            // console.log("teacher", currentRow);
            this.$emit("option-teacher", currentRow); //自定义事件
        },
    },
};
</script>

<style scoped>
</style>