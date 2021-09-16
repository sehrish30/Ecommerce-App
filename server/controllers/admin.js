const Order = require("../models/order");

exports.orders = async (req, res) => {
  try {
    let allOrders = await Order.find({})
      .sort("-createdAt")
      .populate("products.product")
      .exec();

    return res.status(200).json(allOrders);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.orderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;
    let updated = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus,
      },
      {
        new: true,
      }
    ).exec();
    return res.json(updated);
  } catch (err) {
    return res.status(500).json(err);
  }
};
