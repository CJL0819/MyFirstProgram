var express = require("express");
var bodyParser = require("body-parser");//node.js body 解析中间件
var path = require("path");
var app = express();
var router = require("./router.js");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());//body-parser是非常常用的一个express中间件，作用是对post请求的请求体进行解析。

app.use('/node_modules', express.static(path.join(__dirname, "./node_modules")))
app.use(router);


app.listen(3000, () => {
    console.log("runnning...");
})