var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/msm", { useNewUrlParser: true, useUnifiedTopology: true });

//定义规则对象
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Msm', userSchema);
