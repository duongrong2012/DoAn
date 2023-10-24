const multer = require("multer");

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