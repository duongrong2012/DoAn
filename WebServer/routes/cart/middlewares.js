const CartProduct = require("../../models/CartProduct")
const Product = require("../../models/Product")
const { createResponse } = require("../../utils/helpers")

module.exports.validateProductExist = async (req, res, next) => {
    try {
        const product = await Product.findById(req.body.product)

        if (!product) {
            res.status(404).json(createResponse({
                message: "Sản phẩm không tồn tại"
            }))
            return
        }

        if (req.body.quantity < 1) {
            res.status(404).json(createResponse({
                message: "Số lượng sản phẩm muốn mua phải là số nguyên dương"
            }))
            return
        }

        if (product.quantity < req.body.quantity) {
            res.status(404).json(createResponse({
                message: `Sản phẩm chỉ còn ${product.quantity} trong kho`
            }))
            return
        }

        next()
    } catch (error) {
        next(error)
    }
}

module.exports.validateProductExistInCart = async (req, res, next) => {
    try {
        const isExist = await CartProduct.exists({
            product: req.body.product,
        })

        if (isExist) {
            res.status(400).json(createResponse({
                message: "Sản phẩm đã tồn tại trong giỏ hàng"
            }))
            return
        }

        next()
    } catch (error) {
        next(error)
    }
}