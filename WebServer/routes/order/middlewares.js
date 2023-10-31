const Product = require("../../models/Product")
const { createResponse } = require("../../utils/helpers")

module.exports.validateProductsExist = async (req, res, next) => {
    try {
        const results = await Promise.all(req.body.products.map((item) => {
            return Product.exists({
                _id: item.id,
            })
        }))

        const nonExistProduct = results.some((item) => !item)

        if (nonExistProduct) {
            res.status(404).json(createResponse({
                message: "Sản phẩm không tồn tại"
            }))
            return
        }

        next()
    } catch (error) {
        next(error)
    }
}