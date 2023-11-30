const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const sha256 = require('crypto-js/sha256');

const { jwtOptions, accountStatus } = require("../../utils/constants");
const { createResponse, getFilePath } = require("../../utils/helpers");

module.exports.onRegister = async (req, res, next) => {
    try {
        const isExist = await User.exists({
            $or: [
                { username: req.body.username, },
                { email: req.body.email, },
            ]
        });

        if (isExist) {
            return res.status(400).json(createResponse({
                ok: false,
                message: "Username hoặc email đã tồn tại",
            }));
        }

        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            fullName: req.body.fullName,
            password: req.body.password,
            phone: req.body.phone,
            gender: req.body.gender,
        });

        user.password = undefined; //json chi nhan null

        const payload = { id: user._id };

        const token = jwt.sign(payload, jwtOptions.secretOrKey);

        res.json(createResponse({
            results: token,
        }));
    } catch (error) {
        next(error);
    }
};

module.exports.onLogin = async (req, res, next) => {

    try {
        const user = await User.findOne({
            $or: [{ username: req.body.username }, { email: req.body.username }],
            password: sha256(req.body.password).toString(),
        })

        if (!user) {
            next()
            return
        }

        if (user.status !== accountStatus.ACTIVE) {
            res.status(400).json(createResponse({
                message: "Tài khoản đang bị khóa",
            })) //400:bad request
            return
        }

        const payload = { id: user._id };

        const token = jwt.sign(payload, jwtOptions.secretOrKey);

        res.json(createResponse({
            results: token,
        }))

    } catch (error) {
        next(error)
    }
}

module.exports.onGetUser = async (req, res, next) => {

    res.json(createResponse({
        results: req.user
    }))
}

module.exports.updateProfile = async (req, res, next) => {
    try {

        const user = await User.findById(req.user._id)

        if (typeof req.body.currentPassword === 'string' && typeof req.body.newPassword === 'string') {
            const currentPassword = sha256(req.body.currentPassword).toString()

            const isCurrentPasswordMatched = user.password === currentPassword

            if (!isCurrentPasswordMatched) {
                res.status(400).json(createResponse({
                    message: "Mật khẩu hiện tại không chính xác",
                })) //400:bad request
                return
            }

            user.password = req.body.newPassword
        }

        if (req.body.fullName) {
            user.fullName = req.body.fullName
        }

        if (req.body.gender) {
            user.gender = req.body.gender
        }

        if (req.body.phone) {
            user.phone = req.body.phone
        }

        if (req.body.birthDay) {
            user.birthDay = req.body.birthDay
        }

        if (req.file) {
            user.avatar = getFilePath(req.file)
        }

        await user.save({ validateBeforeSave: true })

        res.json(createResponse({
            message: "Tài khoản thay đổi thành công",
        }))
        return

    } catch (error) {
        next(error)
    }
}