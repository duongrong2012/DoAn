const { Schema, model } = require('mongoose');
const yup = require('yup');
const mongooseLeanGetters = require('mongoose-lean-getters');
const { accountStatus } = require('../utils/constants');

const avatarGetter = (value) => {
    if (value.startsWith('http')) return value

    return `${process.env.HOST}${value}`
}

const Level = {
    ONE: '1',
    THREE: '3',
    Five: '5',
}

const adminSchema = new Schema({
    level: {
        type: String,
        enum: {
            values: Object.keys(Gender),
            message: 'cấp không hợp lệ'
        }
    },
    username: {
        trim: true,
        type: String,
        minlength: [1, 'Tên tài khoản phải ít nhất 1 kí tự'],
        maxlength: [50, 'Tên tài khoản tối đa 50 kí tự'],
        required: [true, 'Tên tài khoản là bắt buộc'],
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
        get: avatarGetter,
    },
    password: {
        type: String,
        minlength: [6, 'Mật khẩu tối thiểu 6 kí tự'],
        required: [true, 'Mật khẩu là bắt buộc'],
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    recoveryPasswordCode: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: {
            values: Object.keys(accountStatus),
            message: 'Trạng thái tài khoản không hợp lệ'
        }
    },
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

adminSchema.plugin(mongooseLeanGetters);

const Admin = model('admins', adminSchema)

module.exports = Admin;
