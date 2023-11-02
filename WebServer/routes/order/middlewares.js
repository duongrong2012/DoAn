const Product = require("../../models/Product")
const { createResponse } = require("../../utils/helpers")

module.exports.validateProductsExist = async (req, res, next) => {
    try {
        const results = await Promise.all(req.body.products.map((item) => {
            return Product.findById(item.id)
        }))

        for (let index = 0; index < results.length; index++) {
            const item = results[index];

            if (!item) {
                res.status(404).json(createResponse({
                    message: "Sản phẩm không tồn tại"
                }))
                return
            }

            if (item.quantity < 1) {
                res.status(404).json(createResponse({
                    message: "Số lượng sản phẩm muốn mua phải là số nguyên dương"
                }))
                return
            }

            if (item.quantity < req.body.products[index].quantity) {
                res.status(404).json(createResponse({
                    message: `Sản phẩm chỉ còn ${item.quantity} trong kho`
                }))
                return
            }
        }

        next()
    } catch (error) {
        next(error)
    }
}

