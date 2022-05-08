var express = require("express");
var router = express.Router();
var User = require("./user.js");
var Token = require('./token')
var Teacher = require("./teacher.js");
var Student = require("./student.js");

//注册
router.post("/user/register", (req, res) => {
    // console.log(req.body);
    // res.end("666");
    var body = req.body;
    User.find({
        $or: [
            {
                username: body.username
            }, {
                nickname: body.nickname
            }
        ]
    }, (error, data) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if (data.length !== 0) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "账号或昵称已存在"
            })
        }
        // body.token = md5(md5(body.username) + "msm");
        new User(body).save((error, data) => {
            if (error) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: "server error，存储失败"
                })
            }
            return res.json({
                code: 2000,
                flag: true,
                message: "注册成功"
            })
        })
    })
})
//登录
router.post("/user/login", (req, res) => {
    var body = req.body;
    // console.log("1", req.body);
    const token = Token.encrypt({ username: body.username }, '30s')
    User.findOne({
        username: body.username,
        password: body.password
    }, (error, data) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "账号或密码不存在"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "登陆成功",
            data: {
                token: token
            }
        })
    })
})
//检验登陆状态
router.get('/validate', function (req, res) {
    let data = Token.decrypt(req.headers.token)
    if (data.token) {
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "token检验成功",
        })
    } else {
        return res.status(200).json({
            code: 3001,
            flag: false,
            message: "token失效，重新登录",
        })
    }

})
//获取用户信息
router.get("/user/info", (req, res) => {
    var body = req.query;
    // console.log(body);
    User.findOne({
        username: body.username
    }, (error, data) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "账号不存在或已过期"
            })
        }
        return res.json({
            code: 2000,
            flag: true,
            message: "获取用户信息成功",
            data: {
                username: data.username,
                nickname: data.nickname,
                _id: data._id
            }
        })
    })
})
//退出登录
router.post("/user/logout", (req, res) => {
    return res.status(200).json({
        code: 2000,
        flag: true,
        message: "退出成功"
    })
})
//校验原始登录密码是否正确
router.post("/user/pwd", (req, res) => {
    var body = req.body;
    User.findOne({
        username: body.username,
        password: body.password
    }, (error, data) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                meaasge: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '原始密码错误'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '原始密码正确'
        })
    })
})
//修改登录密码
router.put("/user/pwd", (req, res) => {
    var body = req.body;
    console.log(body);
    User.findOne({
        _id: body.userid,
    }, (error, data) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "修改密码失败"
            })
        }
        data.password = body.password;
        User.findByIdAndUpdate(body.userid, data, error => {
            if (error) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: "server message"
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: "修改密码成功"
            })
        })
    })
})
//获取所有教师列表
router.get("/teacher/list", (req, res) => {
    Teacher.find({}, (error, data) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "查找教师信息成功",
            data: {
                total: data.length,
                rows: data
            }
        })
    })
})
//获取教师信息（分页）
router.post("/teacher/list", (req, res) => {
    //前端传入
    let page = req.body.page || 1;
    let size = req.body.size || 1;
    let searchMap = req.body.searchMap || {};
    //后端真正查询条件
    const obj = {};
    // console.log(searchMap);
    searchMap.jobnumber ? obj["jobnumber"] = searchMap.jobnumber : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.role ? obj["role"] = searchMap.role : obj;
    searchMap.entrydate ? obj["entrydate"] = searchMap.entrydate : obj;

    Teacher.find(obj, (error, data) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        let count = data.length;
        Teacher.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec((error, data) => {
            if (error) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: "server error"
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: "查找成功",
                data: {
                    total: count,
                    rows: data
                }
            })
        })

    })
})
//新增教师信息
router.post("/teacher", (req, res) => {
    var body = req.body;
    new Teacher(body).save(error => {
        if (error) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "新增失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "新增成功"
        })
    })
})
//通过ID查找一条教师信息
router.get("/teacher", (req, res) => {
    Teacher.findById(req.query.id, (error, data) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "查找失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "查找成功",
            data: data
        })
    })
})
//更新一条教师信息
router.put("/teacher", (req, res) => {
    var id = req.body._id;
    Teacher.findByIdAndUpdate(id, req.body, function (error) {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "更新失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "更新成功"
        })
    })
})
//删除一条教师信息
router.delete('/teacher', function (req, res) {
    Teacher.findByIdAndRemove(req.body.id, function (err) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "删除失败"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "删除成功"
        })
    })
});
//获取学生信息（分页）
router.post('/student/list', (req, res) => {
    //前端传入的数据
    let page = req.body.page || 1;
    let size = req.body.size || 10;
    let searchMap = req.body.searchMap || {};
    //后端真正的查询条件
    const obj = {};
    searchMap.stunum ? obj['stunum'] = searchMap.stunum : obj;
    searchMap.name ? obj['name'] = searchMap.name : obj;
    searchMap.admissiondate ? obj['admissiondate'] = searchMap.admissiondate : obj;
    searchMap.teacher ? obj['teacher'] = searchMap.teacher : obj;
    searchMap.class ? obj['class'] = searchMap.class : obj;
    searchMap.job ? obj['job'] = searchMap.job : obj;
    searchMap.money ? obj['money'] = searchMap.money : obj;

    Student.find(obj, (error, data) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error",
            })
        }
        let count = data.length;
        Student.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec((error, data) => {
            if (error) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    meaasge: "serve error",
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: "查找学生信息成功",
                data: {
                    total: count,
                    rows: data,
                }
            })
        });
    })
})
//新增学生
router.post('/student', (req, res) => {
    // console.log(req.body);
    new Student(req.body).save(function (error) {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flog: false,
                message: "server error"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "新增学员成功"
        })
    })
})
//根据id查找学员信息
router.get('/student', (req, res) => {
    Student.findById(req.query.id, (error, data) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "根据ID查找学员信息失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "根据ID查找学员信息成功",
            data: data
        })
    })
})
//更新学员信息
router.put("/student", (req, res) => {
    Student.findByIdAndUpdate(req.body._id, req.body, (error) => {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "更新失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "更新成功"
        })
    })
})
//根据ID删除学员信息
router.delete("/student", (req, res) => {
    Student.findByIdAndRemove(req.body.id, function (error) {
        if (error) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "删除学员信息失败"
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "删除学员信息成功"
        })
    })
})




module.exports = router;