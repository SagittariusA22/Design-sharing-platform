const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    open:true,
    host: 'localhost',

    // before:require('./src/mock'),
    // 代理服务器
    // proxy: {
    //   "/api": {
    //     // 匹配所有以 '/api'开头的请求路径，需要去app.vue 中加入前缀
    //     target: "http://1.116.64.64:5004/api2/", // 代理目标的基础路径
    //     changeOrigin: true,
    //     pathRewrite: { "^/api": "" }, // 去往目标时去掉开头
    //   },
    // },
  }

})
