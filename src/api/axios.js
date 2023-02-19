//axios的封装
import axios from "axios";
import { Message } from "element-ui";
import { getToken } from "@/Utils/Token.js"

const axios1 = axios.create({
    timeout:3000,
    // baseURL:'http://localhost:8080/api',
    baseURL:'/api',
})

// 多次点击取消之前的请求
// const { CancelToken } = axios
// let cancel

// 请求拦截器
axios1.interceptors.request.use((config) => {
    
    // 多次点击取消之前的请求
    // if(cancel) cancel()
    // config.cancelToken = new CancelToken( c => cancel = c)

    // 带上token
    config.headers.token = getToken('token')    
    // 一定记得返回
    return config
});

// 响应拦截器
axios1.interceptors.response.use(
    response => {
        // 取到status 和 message 进行判断 
        let { status, message} = response.data
        if(status >= 200 && status<300 ){
           // 一定记得返回
        return response
        }else{
            Message({ message: "错误", type:"warning" })
        }
    },
    error => {
        // return new Promise(()=>{})
        return Promise.reject(error)
    }
)

export default axios1