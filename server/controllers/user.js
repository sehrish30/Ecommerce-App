const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;

    let products = [];
    // change product because of color and count change
    const user = await User.findOne({ email: req.user.email }).exec();

    // check if cart with logged in user already exists
    let cartExistByThisUser = await Cart.findOne({ orderBy: user._id }).exec();
    if (cartExistByThisUser) {
      console.log("ALREADY EXISTS", cartExistByThisUser);
      // mongoose remove method
      cartExistByThisUser.remove();
    }

    for (let i = 0; i < cart.length; i++) {
      let object = {};

      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;

      // get price for getting total by db for security
      let { price } = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
      object.price = price;
      products.push(object);
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }

    // create cart
    await new Cart({
      products,
      cartTotal,
      orderBy: user._id,
    }).save();

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();

    let cart = await Cart.findOne({ orderBy: user._id })
      .populate("products.product", "price _id title totalAfterDiscount")
      .exec();

    const { products, cartTotal, totalAfterDiscount } = cart;
    return res.json({
      products,
      cartTotal,
      totalAfterDiscount,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();

    const cart = await Cart.findOneAndDelete({ orderBy: user._id }).exec();
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json(err);
  }
};
