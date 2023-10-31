const { Schema, model } = require('mongoose');
const sha256 = require('crypto-js/sha256');
const yup = require('yup');
const mongooseLeanGetters = require('mongoose-lean-getters');
const { accountStatus } = require('../utils/constants');

const Gender = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER',
}

const avatarGetter = (value) => {
    if (value.startsWith('http')) return value

    return `${process.env.HOST}${value}`
}

const userSchema = new Schema({
    username: {
        trim: true,
        type: String,
        minlength: [1, 'Tên tài khoản phải ít nhất 1 kí tự'],
        maxlength: [50, 'Tên tài khoản tối đa 50 kí tự'],
        required: [true, 'Tên tài khoản là bắt buộc'],
    },
    email: {
        type: String,
        validate: {
            message: () => 'Email không hợp lệ',
            validator: (value) => yup.string().email().isValidSync(value)
        },
        required: [true, 'Email là bắt buộc'],
    },
    fullName: {
        type: String,
        maxlength: [50, 'Tên người dùng tối đa 50 kí tự'],
        default: "",
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
        get: avatarGetter,
    },
    phone: {
        type: String,
        maxlength: [15, 'Tên người dùng tối đa 15 kí tự'],
        default: ""
    },
    address: {
        type: String,
        default: "",
        maxlength: [100, 'Địa chỉ tối đa 100 kí tự'],
    },
    birthDay: {
        type: Date,
    },
    password: {
        type: String,
        minlength: [6, 'Mật khẩu tối thiểu 6 kí tự'],
        required: [true, 'Mật khẩu là bắt buộc'],
    },
    gender: {
        type: String,
        enum: {
            values: Object.keys(Gender),
            message: 'Giới tính không hợp lệ'
        }
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
        default: accountStatus.ACTIVE,
        enum: {
            values: Object.keys(accountStatus),
            message: 'Trạng thái tài khoản không hợp lệ'
        }
    },
}, {
    versionKey: false,
    timestamps: true,
}) //khong hien thi version document

userSchema.plugin(mongooseLeanGetters);

userSchema.pre('save', function (next, options) {
    if (this.isModified('password')) {
        this.password = sha256(this.password).toString();
    }

    next();
});

const User = model('users', userSchema)

module.exports = User;
