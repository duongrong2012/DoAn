const { Error } = require("mongoose");
const multer = require("multer");

const requestedIPs = {}

const storage = multer.diskStorage({
    destination: 'public/images/user_avatar/',
    filename: (req, file, cb) => {
        const fileExtensionArray = file.originalname.split('.');

        const fileExtension = fileExtensionArray[fileExtensionArray.length - 1]; //lay duoi file

        cb(null, `${req.user._id}.${fileExtension}`);
    },
});

module.exports.userAvatarMulter = multer({
    storage,
    limits: {
        files: 1,
        fileSize: 5242880, // 5 MB
    },
    fileFilter: function (req, file, cb) {
        const isImage = file.mimetype.startsWith('image/');

        if (!isImage) {
            return cb(new Error('Tệp không hợp lệ'));
        }

        cb(null, true);
    },
});

module.exports.checkBruteForceAttack = async (req, res, next) => {

    if (!requestedIPs[req.ip]) {
        requestedIPs[req.ip] = {
            firstTimeAttempt: Date.now(),
            count: 1,
        }
        next(new Error('Sai tên tài khoản hoặc mật khẩu'))
        return
    }

    requestedIPs[req.ip].count += 1

    const isInAttemptTime = (Date.now() - requestedIPs[req.ip].firstTimeAttempt) <= 15000

    if (isInAttemptTime && requestedIPs[req.ip].count > 3) {
        requestedIPs[req.ip].startedBanTime = Date.now()

        next(new Error('Xin vui lòng thử lại sau'))
        return
    }

    if (requestedIPs[req.ip].startedBanTime) {
        const isInBannedTime = (Date.now() - requestedIPs[req.ip].startedBanTime) <= 180000

        if (isInBannedTime) {
            next(new Error('Xin vui lòng thử lại sau'))

            return
        }

        requestedIPs[req.ip].count = 1

        requestedIPs[req.ip].firstTimeAttempt = Date.now()

        requestedIPs[req.ip].startedBanTime = undefined

    }

    next(new Error('Sai tên tài khoản hoặc mật khẩu'))
}



