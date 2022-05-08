import request from "@/utils/request";

export default {
  getList() {
    return request({
      method: "get",
      url: "/teacher/list",
    })
  },
  search(page, size, searchMap) {
    return request({
      method: "post",
      url: "/teacher/list",
      data: {
        page,
        size,
        searchMap
      }
    })
  },
  add(teacher) {
    return request({
      method: "post",
      url: "/teacher",
      data: teacher
    })
  },
  getById(id) {
    return request({
      method: "get",
      url: `/teacher?id=${id}`
    })
  },
  update(teacher) {
    return request({
      method: "put",
      url: "/teacher",
      data: teacher
    })
  },
  deleteById(id) {
    return request({
      url: `/teacher`, // 反单引号 ``
      method: 'delete', // delete 方式提交
      data: {
        id
      }
    })
  }


}