const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const sha256 = require('crypto-js/sha256');

const { jwtOptions, accountStatus } = require("../../utils/constants");
const { createResponse, getFilePath, getPaginationConfig } = require("../../utils/helpers");
const Admin = require("../../models/Admin");
const getSlug = require("speakingurl");
const { default: mongoose } = require("mongoose");
const { ProductImage, imageType } = require("../../models/ProductImage");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Order = require("../../models/Order");
const OrderDetail = require("../../models/OrderDetail");

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

        const payload = { id: admin._id };

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

        const payload = { id: admin._id };

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

module.exports.onGetUserInfor = async (req, res, next) => {
    try {
        const { page, limit } = getPaginationConfig(req, 1, 10)

        const filter = {}

        const { keyword } = req.query;

        if (keyword) {
            const serarator = ' ';

            filter.$text = {
                $search: `"${keyword}"`
            };
        }

        const totalQuery = User.countDocuments(filter)

        const productQuery = User.find(filter)
            .select("-password -recoveryPasswordCode")
            .skip((page - 1) * limit)
            .limit(limit)
            .lean({ getters: true })

        const [total, products] = await Promise.all([totalQuery, productQuery])

        res.json(createResponse({
            results: products, total
        }))


    } catch (error) {
        next(error)
    }
}

module.exports.UpdateUserByAdmin = async (req, res, next) => {
    try {

        const user = await User.findById(req.params.id)

        if (req.body.status) {
            user.status = req.body.status
        }

        await user.save({ validateBeforeSave: true })

        res.json(createResponse({
            message: "Tài khoản thay đổi thành công",
        }))

    } catch (error) {
        next(error)
    }
}

module.exports.onCreateProduct = async (req, res, next) => {
    try {
        const product = {
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            description: req.body.description,
            slug: getSlug(`${req.body.name}-${Date.now()}`)
        }

        if (req.body.categories instanceof Array) {
            product.categories = [...new Set(req.body.categories)]
        }

        if (req.files.length !== 4) {
            res.json(createResponse({
                message: "số file ảnh phải bằng 4"
            }))
            return
        }
        const productId = new mongoose.Types.ObjectId()

        product._id = productId

        const promises = req.files.map((item, index) => {
            const type = index === 0 ? imageType.COVER_IMAGE : imageType.SLIDE_IMAGES

            return ProductImage.create({ productId, type, url: getFilePath(item) })
        })

        const images = await Promise.all(promises)

        product.images = images.map((item) => item._id)

        await Product.validate(product, ["name", "quantity", "price", "description", "slug", "uploader"])

        await Product.create(product)

        await Category.updateMany({
            _id: { $in: product.categories }
        }, { $inc: { productCount: 1 } })

        res.json(createResponse())

    } catch (error) {
        next(error)
    }
};

module.exports.onUpdateProductByAdmin = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            res.status(404).json(createResponse({
                message: "Id sản phẩm không hợp lệ",
            }))
            return
        }

        if (req.body.name) {
            product.name = req.body.name
            product.slug = getSlug(`${req.body.name}-${Date.now()}`)
        }

        if (req.body.quantity) {
            product.quantity = req.body.quantity
        }

        if (req.body.price) {
            product.price = req.body.price
        }

        if (req.body.description) {
            product.description = req.body.description
        }

        if (req.files) {
            if (req.files.length !== 4) {
                res.json(createResponse({
                    message: "số file ảnh phải bằng 4"
                }))
                return
            }

            const promises = product.images.map((item, index) => {
                return ProductImage.updateOne({ _id: item }, { url: getFilePath(req.files[index]) })
            });

            await Promise.all(promises)
        }

        await product.save({ validateBeforeSave: true, validateModifiedOnly: true })

        res.json(createResponse({
            message: "Sản phẩm thay đổi thành công",
        }))

    } catch (error) {
        next(error)
    }
}

module.exports.onCreateCategory = async (req, res, next) => {
    try {
        const query = {
            name: req.body.name,
            slug: getSlug(req.body.name)
        }

        if (req.body.parentCategory) {
            query.parentCategory = req.body.parentCategory
        }

        if (req.file) {
            query.image = getFilePath(req.file)
        }

        const category = await Category.create(query)

        res.json(createResponse({
            results: category
        }))

    } catch (error) {
        next(error)
    }
};

module.exports.onUpdateCategoryByAdmin = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            res.status(404).json(createResponse({
                message: "Category Id không hợp lệ",
            }))
            return
        }

        if (req.body.name) {
            category.name = req.body.name
            category.slug = getSlug(req.body.name)
        }

        if (req.file) {
            category.image = getFilePath(req.file)
        }

        await category.save({ validateBeforeSave: true, validateModifiedOnly: true })

        res.json(createResponse({
            message: "Danh mục thay đổi thành công",
        }))

    } catch (error) {
        next(error)
    }
}

module.exports.onGetAllOrderList = async (req, res, next) => {
    try {
        const { page, limit } = getPaginationConfig(req, 1, 10)

        const sort = {}

        const filter = {}

        if (req.query.user) {
            filter.user = req.query.user
        }

        const totalQuery = Order.countDocuments(filter)

        const orderQuery = Order.find(filter)
            .sort(sort)
            .populate({
                path: "orderDetails",
                populate: {
                    path: 'images',
                }
            })
            .populate("user")
            .skip((page - 1) * limit)
            .limit(limit)
            .lean({ getters: true })

        const [total, orders] = await Promise.all([totalQuery, orderQuery])

        res.json(createResponse({
            results: orders, total
        }))

    } catch (error) {
        next(error)
    }
};

module.exports.onGetUserOrderDetailByAdmin = async (req, res, next) => {
    try {
        const orderDetails = await Order.findById(req.params.id)
            .populate({
                path: "orderDetails",
                populate: {
                    path: 'images',
                }
            })
            .populate("user")
            .lean({ getters: true })

        res.json(createResponse({
            results: orderDetails
        }))

    } catch (error) {
        next(error)
    }
};

module.exports.onUpdateOrderByAdmin = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            res.status(404).json(createResponse({
                message: "order Id không hợp lệ",
            }))
            return
        }

        if (req.body.status) {
            order.status = req.body.status
        }

        await order.save({ validateBeforeSave: true, validateModifiedOnly: true })

        res.json(createResponse({
            message: "Cập nhật đơn hàng thành công",
        }))

    } catch (error) {
        next(error)
    }
}

