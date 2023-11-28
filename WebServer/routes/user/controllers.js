const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const sha256 = require('crypto-js/sha256');

const { jwtOptions, accountStatus } = require("../../utils/constants");
const { createResponse } = require("../../utils/helpers");

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