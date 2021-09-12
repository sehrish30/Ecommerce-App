const Coupon = require("../models/coupon");
const Product = require("../models/product");

exports.create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body.coupon;
    return res.json(await new Coupon({ name, expiry, discount }).save());
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.couponId;
    return res.json(await Coupon.findByIdAndDelete(id).exec());
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.list = async (req, res) => {
  try {
    return res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    return res.status(500).json(err);
  }
};
