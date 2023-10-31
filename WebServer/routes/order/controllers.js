const Order = require("../../models/Order")
const OrderDetail = require("../../models/OrderDetail")
const Product = require("../../models/Product")
const { createResponse, getPaginationConfig } = require("../../utils/helpers")

module.exports.onBuyProduct = async (req, res, next) => {
    try {
        const orderModel = {
            user: req.user._id,
            deliveryAddress: req.body.deliveryAddress,
        }

        await Order.validate(orderModel)

        // req.body.products =[{id,quantity}]

        await Promise.all(req.body.products.map(async (item) => {
            return OrderDetail.validate({
                quantity: item.quantity,
            }, ["quantity"])
        }))

        const order = await Order.create(orderModel)

        const orderDetails = await Promise.all(req.body.products.map(async (item) => {
            const product = await Product.findByIdAndUpdate(item.id, {
                $inc: {
                    totalSold: item.quantity,
                    quantity: -item.quantity,
                }
            })

            return OrderDetail.create({
                name: product.name,
                categories: product.categories,
                totalRatings: product.totalRatings,
                totalRatingPoints: product.totalRatingPoints,
                price: product.price,
                description: product.description,
                quantity: item.quantity,
                order: order._id,
                product: product._id,
                images: product.images,
            })
        }))

        order.orderDetails = orderDetails.map((item) => item._id)

        await order.save()

        res.json(createResponse({
            message: "Đặt Hàng Thành Công"
        }))

    } catch (error) {
        next(error)
    }
}


module.exports.onGetOrderList = async (req, res, next) => {
    try {
        const { page, limit } = getPaginationConfig(req, 1, 10)

        const sort = {}

        const filter = {
            user: req.user._id,
        }

        const orders = await Order.find(filter)
            .sort(sort)
            .populate({
                path: "orderDetails",
                populate: {
                    path: 'images',
                }
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean({ getters: true })

        res.json(createResponse({
            results: orders
        }))

    } catch (error) {
        next(error)
    }
};

module.exports.onGetOrderDetail = async (req, res, next) => {
    try {
        const { page, limit } = getPaginationConfig(req, 1, 10)
        console.log("aaaaaaa")
        const sort = {}

        const filter = {
            order: req.params.id
        }

        const orderDetails = await OrderDetail.find(filter)
            .sort(sort)
            .populate("images")
            .skip((page - 1) * limit)
            .limit(limit)
            .lean({ getters: true })

        res.json(createResponse({
            results: orderDetails
        }))

    } catch (error) {
        next(error)
    }
};