// import { resolve } from "core-js/fn/promise";

// 设置异步间隔延迟
export function delay(interval = 0){
    return new Promise(resolve => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            resolve();
        }, interval);
    });
}

// 文件按照二进制读取
export function readFile(file){
    return new Promise(resolve => {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = ev => {
            resolve(ev.target.result)
        };
    });
};

// 字段对应表
export let character = {
    name:{
        text: "姓名",
        type: "string"
    },
    phone:{
        text: "联系方式",
        type: "string" 
    },
    sex:{
        text: "性别",
        type: "string" 
    },
    email:{
        text: "邮箱",
        type: "string" 
    },
    cardId:{
        text: "身份证",
        type: "string" 
    },

};