const Order = require('../../../models/Order');
const { OrderStatus } = require('../../../utils/constants');
const { createResponse } = require('../../../utils/helpers');

module.exports.getRevenue = async (req, res, next) => {
  try {
    const { type, year } = req.query;

    if (type === 'MONTH' && year) {
      const revenueObj = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0
      }

      const orders = await Order.find({
        createdAt: {
          $gte: new Date(+year, 1, 1), //gte:greater than or equal
          $lte: new Date(+year, 12, 31), //let: less than or equal
        },
        status: OrderStatus.DELIVERED
      })
        .populate("orderDetails")
        .lean();

      orders.forEach((item) => {
        const itemDate = new Date(item.createdAt)

        revenueObj[itemDate.getUTCMonth() + 1] += item.orderDetails.reduce((total, detailItem) => (
          total + detailItem.quantity * detailItem.price
        ), 0)
      })

      const results = Object.keys(revenueObj).map((key) => ({
        month: key,
        price: revenueObj[key]
      }))

      res.json(createResponse({
        results
      }))
    } else {
      const revenueObj = {}

      const orders = await Order.find({ status: OrderStatus.DELIVERED })
        .populate("orderDetails")
        .lean();

      orders.forEach((item) => {
        const itemDate = new Date(item.createdAt)

        if (!revenueObj[itemDate.getUTCFullYear()]) {
          revenueObj[itemDate.getUTCFullYear()] = 0
        }

        revenueObj[itemDate.getUTCFullYear()] += item.orderDetails.reduce((total, detailItem) => (
          total + detailItem.quantity * detailItem.price
        ), 0)
      })

      const results = Object.keys(revenueObj).map((key) => ({
        year: key,
        price: revenueObj[key]
      }))

      res.json(createResponse({
        results
      }))
    }
  } catch (error) {
    next(error);
  }
}