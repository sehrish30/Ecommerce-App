const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");

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
      let productDb = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
      object.price = productDb.price;
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

exports.saveAddress = async (req, res) => {
  try {
    const userAddress = await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      {
        address: req.body.address,
      }
    ).exec();
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.applyCouponToUserCart = async (req, res) => {
  try {
    const { coupon } = req.body;

    // validate coupon
    const validCoupon = await Coupon.findOne({ name: coupon }).exec();

    if (!validCoupon) {
      return res.status(403).json({
        err: "Invalid coupon",
      });
    }
    console.log("Valid", validCoupon);

    // user data
    const user = await User.findOne({ email: req.user.email }).exec();

    // get user cart to apply discount
    let { products, cartTotal } = await Cart.findOne({
      orderBy: user._id,
    })
      .populate("products.product", "_id title price")
      .exec();

    console.log("PRODUCTS discount", validCoupon, cartTotal);

    // total After discount
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    await Cart.findOneAndUpdate(
      { orderBy: user._id },
      {
        totalAfterDiscount,
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      console.log("DOUBT", result);
      return res.status(201).json(totalAfterDiscount);
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({
    email: req.user.email,
  }).exec();

  // cart completed empty the cart and save it as order
  let { products } = await Cart.findOne({
    orderBy: user._id,
  }).exec();

  let newOrder = await new Order({
    products,
    paymentIntent,
    orderBy: user._id,
  }).save();

  // decrement quantity, increment sold
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: {
          _id: item.product._id,
        },
        update: {
          $inc: { quantity: -item.count, sold: +item.count },
        },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, { new: true });
  console.log("PRODUCT QUANTITI  DECREMENTED AND SOLD", updated);

  // Product.bulkWrite
  res.json({ ok: true });
};

exports.orders = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user.email }).exec();

    let userOrders = await Order.find({ orderBy: user._id })
      .populate("products.product")
      .exec();
    return res.status(200).json(userOrders);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $addToSet: {
          wishlist: productId,
        },
      }
    ).exec();

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.wishlist = async (req, res) => {
  try {
    const list = await User.findOne({ email: req.user.email })
      .select("wishlist")
      .populate("wishlist")
      .exec();
    return res.status(200).json(list);
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $pull: { wishlist: productId },
      }
    ).exec();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).send(err);
  }
};
