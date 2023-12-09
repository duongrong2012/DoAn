const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const sha256 = require('crypto-js/sha256');

const { jwtOptions, accountStatus } = require("../../utils/constants");
const { createResponse, getFilePath } = require("../../utils/helpers");
const Admin = require("../../models/Admin");

module.exports.onRegister = async (req, res, next) => {
    try {
        const isExist = await User.exists({
            username: req.body.username
        });

        if (isExist) {
            return res.status(400).json(createResponse({
                ok: false,
                message: "Username đã tồn tại",
            }));
        }

        const admin = await Admin.create({
            username: req.body.username,
            name: req.body.name,
            password: req.body.password,
            level: req.body.level
        });

        admin.password = undefined; //json chi nhan null

        const payload = { id: admin._id, admin: true };

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
        const admin = await Admin.findOne({
            username: req.body.username,
            password: sha256(req.body.password).toString(),
        })

        if (!admin) {
            next()
            return
        }

        if (admin.status !== accountStatus.ACTIVE) {
            res.status(400).json(createResponse({
                message: "Tài khoản đang bị khóa",
            })) //400:bad request
            return
        }

        const payload = { id: admin._id, admin: true };

        const token = jwt.sign(payload, jwtOptions.secretOrKey);

        res.json(createResponse({
            results: token,
        }))

    } catch (error) {
        next(error)
    }
}

module.exports.onGetAdmin = async (req, res, next) => {

    res.json(createResponse({
        results: req.user
    }))
}

