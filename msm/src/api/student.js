import request from '@/utils/request';

export default {
    //带分页查找
    search(page, size, searchMap) {
        return request({
            method: 'post',
            url: '/student/list',
            data: {
                page,
                size,
                searchMap
            }
        })
    },
    //新增学员
    add(pojo) {
        return request({
            method: 'post',
            url: '/student',
            data: pojo
        })
    },
    //根据id查询学员信息
    getById(id) {
        return request({
            method: "get",
            url: `/student?id=${id}`
        })
    },
    //修改学员信息
    update(pojo) {
        return request({
            method: "put",
            url: "/student",
            data: pojo
        })
    },
    //删除学员信息
    deleteById(id) {
        return request({
            method: `delete`,//?????
            url: "/student",
            data: {
                id
            }
        })
    }
}