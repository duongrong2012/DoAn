const { default: mongoose } = require("mongoose");
const multer = require("multer");
const getSlug = require("speakingurl");

const storage = multer.diskStorage({
    destination: 'public/images/productImages/',
    filename: (req, file, cb) => {
        const fileExtensionArray = file.originalname.split('.');

        const slug = getSlug(fileExtensionArray.slice(0, fileExtensionArray.length - 1).join('-'))

        const fileExtension = fileExtensionArray[fileExtensionArray.length - 1]; //lay duoi file

        cb(null, `${new mongoose.Types.ObjectId().toString()}.${fileExtension}`);
    },
});

module.exports.productImageMulter = multer({
    storage,
    limits: {
        files: 4,
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

module.exports.categoryImageMulter = multer({
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