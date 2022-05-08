import request from "@/utils/request"

//登录
export function login(username, password) {
    return request({
        method: "post",
        url: "/user/login",
        data: {
            username,
            password,
        }
    })
}

//获取用户信息
export function getUserInfo(username) {
    return request({
        method: "get",
        url: `/user/info?username=${username}`
    })
}


//退出登录
export function logout() {
    return request({
        method: "post",
        url: "/user/logout",
    })
}