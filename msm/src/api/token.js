import request from "@/utils/request"

//检验
export function token() {
    return request({
        method: "get",
        url: "/validate",
    })
}