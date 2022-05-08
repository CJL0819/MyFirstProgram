var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/msm", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false)

var Schema = mongoose.Schema;
var userSchema = new Schema({
    stunum: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    admissiondate: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    job: {
        type: String,
        required: true
    },
    money: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Student', userSchema)