const CartProduct = require("../../models/CartProduct");
const { createResponse, getPaginationConfig } = require("../../utils/helpers");

module.exports.onAddProduct = async (req, res, next) => {
    try {
        const cart = {
            product: req.body.product,
            user: req.user._id,
            quantity: req.body.quantity,
        }

        const isExist = await CartProduct.exists({
            product: req.body.product,
        })

        if (!isExist) {
            await CartProduct.create(cart)
        } else {
            await CartProduct.updateOne({ product: req.body.product },
                { quantity: req.body.quantity });
        }

        res.json(createResponse({
            message: "Thêm sản phẩm thành công"
        }))

    } catch (error) {
        next(error)
    }
};

module.exports.onGetCartProduct = async (req, res, next) => {
    try {
        const { page, limit } = getPaginationConfig(req, 1, 10)

        const filter = {
            user: req.user._id
        }

        const totalQuery = CartProduct.countDocuments(filter)

        const cartQuery = CartProduct.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: "product",
                populate: {
                    path: 'images',
                }
            })
            .lean({ getters: true })

        const [total, cartProducts] = await Promise.all([totalQuery, cartQuery])

        res.json(createResponse({
            results: cartProducts, total
        }))

    } catch (error) {
        next(error)
    }
};

module.exports.onDeleteProduct = async (req, res, next) => {
    try {
        const filter = {
            user: req.user._id,
            product: req.body.products,
        }

        await CartProduct.deleteMany(filter)

        res.json(createResponse({
            message: "Xóa thành công"
        }))

    } catch (error) {
        next(error)
    }
};