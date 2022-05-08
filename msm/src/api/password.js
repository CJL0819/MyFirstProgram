import request from '@/utils/request.js'

export default {
    //校验原始密码是否正确
    checkPwd(username, password) {
        return request({
            method: "post",
            url: "/user/pwd",
            data: {
                username,
                password
            }
        })
    },
    //修改登陆密码
    updatePwd(userid, password) {
        return request({
            method: "put",
            url: "/user/pwd",
            data: {
                userid,
                password
            }
        })
    }
}