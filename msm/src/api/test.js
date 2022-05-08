import request from "@/utils/request";

request.get("/db.json").then(response => {
    console.log("get1", response.data);
}).catch(error => {
    console.log(error.message);
})

request({
    url: "/db.json",
    methd: "get"
}).then(response => {
    console.log("get2", response.data);
})

export default {
    getList() {
        const req = request({
            url: "/db.json",
            method: "get"
        })
        return req;
    }
}