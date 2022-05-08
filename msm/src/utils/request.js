import axios from "axios"
import { Loading, Message } from 'element-ui';

const loading = {
    loadingInstance: null,//Loading对象实例
    open: function () {
        if (this.loadingInstance === null) {
            this.loadingInstance = Loading.service({
                text: '拼命加载中',
                background: 'rgba(0,0,0,0.5)',
                target: '.main'
            })
        }
    },
    close: function () {
        if (this.loadingInstance !== null) {
            this.loadingInstance.close();
        }
        this.loadingInstance = null;
    },
}



const request = axios.create({
    // baseURL: "/", //根据不同环境设置baseUrl，最终发送请求时URL为：baseUrl+
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000 //请求超时
})

//请求拦截器
request.interceptors.request.use(config => {
    loading.open();
    const token = localStorage.getItem('msm-token')
    if (token) {
        config.headers['token'] = `${token}`
    }
    return config;//请求拦截
}, error => {
    loading.close();
    return Promise.reject(error);//出现异常，抛出错误对象
})

//响应拦截器
request.interceptors.response.use(response => {
    loading.close();
    const resp = response.data;
    if (resp.code !== 2000) {
        Message({
            message: resp.message || "系统异常",
            type: "warning",
            duration: 5000
        })
    }

    return response;//response.data
}, error => {
    loading.close();
    Message({
        message: resp.message,
        type: "error",
        duration: 5000,
    })
    return Promise.reject(error);
})

export default request