const Order = require('../../../models/Order');
const { createResponse } = require('../../../utils/helpers');

module.exports.getRevenue = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    const orders = await Order.find().lean();

    res.json(createResponse({
      results: orders,
    }))
  } catch (error) {
    next(error);
  }
}