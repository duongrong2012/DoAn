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
        validate: {
            message: () => 'Tên tài khoản không hợp lệ',
            validator: (value) => nameRegExp.test(value)
        },
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
        required: [true, 'Tên người dùng là bắt buộc'],
        validate: {
            message: () => 'Tên người dùng không hợp lệ',
            validator: (value) => nameRegExp.test(value)
        },
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
        get: avatarGetter,
    },
    phone: {
        type: String,
        minlength: [10, 'Số điện thoại phải có độ dài là 10 kí tự'],
        maxlength: [10, 'Số điện thoại phải có độ dài là 10 kí tự'],
        validate: {
            message: () => 'Số điện thoại không hợp lệ',
            validator: (value) => phoneRegExp.test(value)
        },
    },
    address: {
        type: String,
        default: "",
        maxlength: [100, 'Địa chỉ tối đa 100 kí tự'],
        validate: {
            message: () => 'Địa chỉ không hợp lệ',
            validator: (value) => {
                if (!value) return true

                return addressRegExp.test(value)
            }
        },
    },
    birthDay: {
        type: Date,
    },
    password: {
        type: String,
        minlength: [8, 'Mật khẩu tối thiểu 8 kí tự'],
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

const passwordRegExp = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/
const addressRegExp = /^[#.0-9a-zA-Z\s,-]+$/ //chi duoc co dau - , . #
const phoneRegExp = /^[0-9]+$/

const nameRegExp = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/ //a->z ,A->Z,0->9,chi duoc co dau '.' va dau'_'

userSchema.pre('save', function (next, options) {
    if (this.isModified('password')) {

        if (!passwordRegExp.test(this.password)) {
            next(new Error('Mật khẩu phải có ít nhất 1 kí tự ghi hoa, 1 kí tự đặc biệt, 1 kí tự số và phải có độ dài tối thiểu 8 kí tự'))
            return
        }

        this.password = sha256(this.password).toString();
    }

    next();
});

const User = model('users', userSchema)

module.exports = User;
