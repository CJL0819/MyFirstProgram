var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/msm", { useNewUrlParser: true, useUnifiedTopology: true });

//定义规则对象
var Schema = mongoose.Schema;
var userSchema = new Schema({
    jobnumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    entrydate: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Teacher', userSchema);
