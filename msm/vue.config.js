module.exports = {
    // publicPath: process.env.NODE_ENV == 'development' ? '/' : './',
    outputDir: 'dist',//打包之后存放文件的位置
    assetsDir: 'assets',//打包之后存放静态支资源的文件夹
    publicPath: './',
    lintOnSave: false,//默认true，警告仅会被输出到命令行，不影响编译
    productionSourceMap: false, //打包时不生成.map文件

    devServer: {
        port: 8888,//端口号，如果端口号被占用，会自动提示1
        open: true,//启动服务器是否打开浏览器
        https: false,//https协议是否启用
        host: 'localhost',//主机名
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: process.env.VUE_APP_SERVICE_URL,//目标服务器
                changOrigin: true,//开启代理，会创建虚拟服务器，来接受发送相应请求及数据
                pathRewrite: {//会将  /dev-api 替换为' '  如 /dev-api/db.json 代理为 http://localhost:8080/db.json
                    ["^" + process.env.VUE_APP_BASE_API]: ''
                }
            }
        }
    },


}