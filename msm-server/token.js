const jwt = require('jsonwebtoken')
const Token = {
    encrypt: function (data, time) {
        return jwt.sign(data, 'msm', { expiresIn: time })//加密
    },
    decrypt: function (token) {
        if (!token) {
            return {
                token: false
            }
        }
        try {
            jwt.verify(token, 'msm');//解密
            return {
                token: true
            }
        } catch (e) {
            return {
                token: false,
                data: e
            }
        }
    }
}
module.exports = Token